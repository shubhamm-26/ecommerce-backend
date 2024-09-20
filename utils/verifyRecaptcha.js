const axios = require("axios");
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;

async function verifyRecaptcha(token) {
    const response = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${token}`
    );
    console.log(response.data);
    return response.data.success;
}

module.exports = verifyRecaptcha;
