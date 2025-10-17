output "api_gateway_url" {
  description = "API Gateway endpoint URL"
  value       = "https://${aws_api_gateway_rest_api.qr_api.id}.execute-api.${var.aws_region}.amazonaws.com/${aws_api_gateway_deployment.qr_api.stage_name}"
}

output "generate_qr_endpoint" {
  description = "Generate QR code endpoint URL"
  value       = "https://${aws_api_gateway_rest_api.qr_api.id}.execute-api.${var.aws_region}.amazonaws.com/${aws_api_gateway_deployment.qr_api.stage_name}/generate"
}

output "s3_bucket_name" {
  description = "S3 bucket name for QR codes"
  value       = aws_s3_bucket.qr_codes.bucket
}

output "s3_bucket_arn" {
  description = "S3 bucket ARN"
  value       = aws_s3_bucket.qr_codes.arn
}

output "lambda_function_name" {
  description = "Lambda function name"
  value       = aws_lambda_function.qr_generator.function_name
}

output "lambda_function_arn" {
  description = "Lambda function ARN"
  value       = aws_lambda_function.qr_generator.arn
}