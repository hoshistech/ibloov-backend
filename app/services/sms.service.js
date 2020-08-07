const smsProvider = require("@providers/sms/twilio.provider");

module.exports = {

    phoneNumberVerification: async( to, code  ) => {

        const smsVerificationCodeDuration = process.env.SMS_VERIFICATION_CODE_DURATION;

        body = `${code} is your Ibloov verification code. Valid for ${smsVerificationCodeDuration} minutes.`;
        let resp =  await smsProvider.sendOne(to, body);
        return resp;
    }
}