const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1'
});

const uploadQRCodeToS3 = async (qrCodeBuffer, filename, qrMetadata = {}) => {
    const { text, size, errorCorrectionLevel } = qrMetadata;

    const bucketName = process.env.BUCKET_NAME;
    if (!bucketName) {
        throw new Error('BUCKET_NAME environment variable is not set');
    }

    const region = process.env.AWS_REGION || 'us-east-1';

    const metadata = {
        'generated-text': text || '',
        'qr-size': size ? size.toString() : '',
        'error-correction-level': errorCorrectionLevel || '',
        'generated-at': new Date().toISOString(),
        'file-type': 'qr-code'
    };

    const uploadCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: filename,
        Body: qrCodeBuffer,
        ContentType: 'image/png',
        Metadata: metadata
    });

    await s3Client.send(uploadCommand);

    return `https://${bucketName}.s3.${region}.amazonaws.com/${filename}`;
};

const validateS3Config = () => {
    const missing = [];
    
    if (!process.env.BUCKET_NAME) {
        missing.push('BUCKET_NAME');
    }
    
    if (!process.env.AWS_REGION) {
        missing.push('AWS_REGION');
    }

    return {
        isValid: missing.length === 0,
        missing: missing,
        bucketName: process.env.BUCKET_NAME,
        region: process.env.AWS_REGION || 'us-east-1'
    };
};

module.exports = {
    uploadQRCodeToS3,
    validateS3Config
};