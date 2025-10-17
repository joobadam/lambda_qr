const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const { uploadQRCodeToS3, validateS3Config } = require('../utils/s3');

exports.handler = async (event, context) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
        'Content-Type': 'application/json'
    };

    try {
        if (event.httpMethod === 'OPTIONS') {
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({ message: 'CORS preflight successful' })
            };
        }

        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    error: 'Method not allowed. Only POST requests are supported.'
                })
            };
        }

        let requestBody;
        try {
            requestBody = JSON.parse(event.body);
        } catch (parseError) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    error: 'Invalid JSON in request body'
                })
            };
        }

        const { text, size, errorCorrectionLevel } = requestBody;

        if (!text || typeof text !== 'string') {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    error: 'Text parameter is required and must be a string'
                })
            };
        }

        if (text.length > 2000) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    error: 'Text parameter must be 2000 characters or less'
                })
            };
        }

        const qrSize = size || 200;
        if (qrSize < 100 || qrSize > 1000) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    error: 'Size parameter must be between 100 and 1000'
                })
            };
        }

        const validErrorLevels = ['L', 'M', 'Q', 'H'];
        const errorLevel = errorCorrectionLevel || 'M';
        if (!validErrorLevels.includes(errorLevel)) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    error: 'Error correction level must be one of: L, M, Q, H'
                })
            };
        }

        const qrCodeBuffer = await QRCode.toBuffer(text, {
            type: 'png',
            width: qrSize,
            errorCorrectionLevel: errorLevel,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });

        const s3Config = validateS3Config();
        if (!s3Config.isValid) {
            throw new Error(`S3 configuration is invalid. Missing: ${s3Config.missing.join(', ')}`);
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const uniqueId = uuidv4();
        const filename = `qr-${timestamp}-${uniqueId}.png`;

        const qrCodeUrl = await uploadQRCodeToS3(qrCodeBuffer, filename, {
            text: text,
            size: qrSize,
            errorCorrectionLevel: errorLevel
        });

        const response = {
            success: true,
            qrCodeUrl: qrCodeUrl,
            text: text,
            size: qrSize,
            errorCorrectionLevel: errorLevel,
            timestamp: new Date().toISOString(),
            filename: filename
        };

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(response)
        };

    } catch (error) {
        console.error('Error generating QR code:', error);

        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                success: false,
                error: 'Internal server error while generating QR code',
                message: error.message
            })
        };
    }
};