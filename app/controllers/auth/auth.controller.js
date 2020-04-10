module.exports = {

    googleAuth: async (req, res) => {

        const user = req.user;
        console.log(user);

        return res.status(200).json({

            success: true,
            message: "Operation successful",
            data: user
        })

    }
}