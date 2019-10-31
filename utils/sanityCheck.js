const exportable = {
	utils: {
		validateName: (name) => {
			const nameRegex = /^[a-zA-Z`!@#$%^&* ]{3,20}$/;
			return nameRegex.test(name)
		},
		validateUserName: (userName) => {
			const usernameRegex = /^[a-zA-Z0-9_`!@#$%^&*]{3,20}$/;
			return usernameRegex.test(userName);
		},
		validateEmail: (email) => {
			const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return emailRegex.test(email);
		}
	}
}

module.exports = exportable;