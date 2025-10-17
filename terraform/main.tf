terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

locals {
  project_name = var.project_name
  environment  = var.environment
}

resource "random_id" "bucket_suffix" {
  byte_length = 4
}

resource "aws_s3_bucket" "qr_codes" {
  bucket = "${local.project_name}-${random_id.bucket_suffix.hex}"
}

resource "aws_s3_bucket_public_access_block" "qr_codes" {
  bucket = aws_s3_bucket.qr_codes.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "qr_codes_public_read" {
  bucket = aws_s3_bucket.qr_codes.id

  depends_on = [aws_s3_bucket_public_access_block.qr_codes]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.qr_codes.arn}/*"
      }
    ]
  })
}

resource "aws_s3_bucket_cors_configuration" "qr_codes" {
  bucket = aws_s3_bucket.qr_codes.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = var.cors_max_age_seconds
  }
}

resource "aws_iam_role" "lambda_execution_role" {
  name = "${local.project_name}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_policy" "lambda_s3_access" {
  name        = "${local.project_name}-lambda-s3-policy"
  description = "Policy for Lambda to upload QR codes to S3"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:PutObjectAcl"
        ]
        Resource = "${aws_s3_bucket.qr_codes.arn}/*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_s3_access" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = aws_iam_policy.lambda_s3_access.arn
}

resource "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "../backend"
  output_path = "lambda.zip"
}

resource "aws_lambda_function" "qr_generator" {
  function_name = local.project_name
  role          = aws_iam_role.lambda_execution_role.arn
  handler       = "handlers/generateQR.handler"
  runtime       = "nodejs20.x"
  timeout       = var.lambda_timeout
  memory_size   = var.lambda_memory_size

  filename         = archive_file.lambda_zip.output_path
  source_code_hash = archive_file.lambda_zip.output_base64sha256

  environment {
    variables = {
      BUCKET_NAME = aws_s3_bucket.qr_codes.bucket
      AWS_REGION  = var.aws_region
    }
  }
}

resource "aws_api_gateway_rest_api" "qr_api" {
  name        = "${local.project_name}-api"
  description = "QR Code Generator API"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_resource" "generate" {
  rest_api_id = aws_api_gateway_rest_api.qr_api.id
  parent_id   = aws_api_gateway_rest_api.qr_api.root_resource_id
  path_part   = "generate"
}

resource "aws_api_gateway_method" "generate_post" {
  rest_api_id   = aws_api_gateway_rest_api.qr_api.id
  resource_id   = aws_api_gateway_resource.generate.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "generate_options" {
  rest_api_id   = aws_api_gateway_rest_api.qr_api.id
  resource_id   = aws_api_gateway_resource.generate.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "generate_post" {
  rest_api_id = aws_api_gateway_rest_api.qr_api.id
  resource_id = aws_api_gateway_resource.generate.id
  http_method = aws_api_gateway_method.generate_post.http_method

  integration_http_method = "POST"
  type                   = "AWS_PROXY"
  uri                    = aws_lambda_function.qr_generator.invoke_arn
}

resource "aws_api_gateway_integration" "generate_options" {
  rest_api_id = aws_api_gateway_rest_api.qr_api.id
  resource_id = aws_api_gateway_resource.generate.id
  http_method = aws_api_gateway_method.generate_options.http_method

  type = "MOCK"

  request_templates = {
    "application/json" = jsonencode({
      statusCode = 200
    })
  }
}

resource "aws_api_gateway_method_response" "generate_options" {
  rest_api_id = aws_api_gateway_rest_api.qr_api.id
  resource_id = aws_api_gateway_resource.generate.id
  http_method = aws_api_gateway_method.generate_options.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods"   = true
    "method.response.header.Access-Control-Allow-Origin"   = true
  }
}

resource "aws_api_gateway_integration_response" "generate_options" {
  rest_api_id = aws_api_gateway_rest_api.qr_api.id
  resource_id = aws_api_gateway_resource.generate.id
  http_method = aws_api_gateway_method.generate_options.http_method
  status_code = aws_api_gateway_method_response.generate_options.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods"   = "'POST,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"   = "'*'"
  }
}

resource "aws_api_gateway_deployment" "qr_api" {
  rest_api_id = aws_api_gateway_rest_api.qr_api.id
  stage_name  = var.api_stage_name

  depends_on = [
    aws_api_gateway_integration.generate_post,
    aws_api_gateway_integration.generate_options,
    aws_api_gateway_integration_response.generate_options
  ]

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.generate.id,
      aws_api_gateway_method.generate_post.id,
      aws_api_gateway_method.generate_options.id,
      aws_api_gateway_integration.generate_post.id,
      aws_api_gateway_integration.generate_options.id,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.qr_generator.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.qr_api.execution_arn}/*/*"
}