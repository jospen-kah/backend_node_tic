const { authRegisterController} = require('../../controllers/auth')
const User =  require('../../auth/usersSchema')

jest.mock('../../auth/usersSchema')

const request = {
     body: {
        username: "fake_username",
        email: "fake_email",
        password: "fake_password"
     }
}
const response = {
    status: jest.fn().mockReturnThis(), 
    json: jest.fn(),
  };

it('should send a status code of 400 when user exists',  async () => {
    User.findOne.mockImplementationOnce( () => ({
        id: 1, 
        email: 'email',
        password: 'password',
    }));          
   await authRegisterController(request, response);
   expect(response.status).toHaveBeenCalledWith(400);
   expect(response.json).toHaveBeenCalledWith({message: 'User already exist'});
});