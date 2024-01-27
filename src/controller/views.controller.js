import { tokenModel } from '../DAL/db/models/tokens.model.js'
import SessionDTO from '../dto/UsersDTO/session.dto.js'
import { UserModel } from '../DAL/db/models/user.model.js'

class ViewsController {

    resetPassword = async (req, res) => {
        try {
            res.render('passwordReset')
        } catch (error) {
            res.send(error)
        }
    }

    createNewPassword = async (req,res) => {
        try {
            const {userId, token} = req.params
            const tokenDB = await tokenModel.findOne({
                userId: userId,
                token: token
            })

            if(!tokenDB){
                res.render('expiredLink')
            } else {
                res.render('createNewPassword', {
                    userId: userId,
                    token: token
                })
            }
        } catch (error) {
            res.send(error)
        }
    }

    uploadDocs = async (req, res) => {
        try {
            // Log the session information for debugging
/*             console.log('Session User upl docs:', req.user); */
    
            const userId = req.user._id;
            const cart = req.user.cart;
            
            res.render('uploadDocument', {
                cart: cart,
                userId: userId,
            });
        } catch (error) {
            res.send(error);
        }
    };

    modifyUser = async (req,res) => {
        try {
            console.log("Entering modifyUser function");
            const {userId} = req.params
            const user = await UserModel.findById(userId)
            const session = new SessionDTO(req.session)
            const {role} = session
            if(role === "admin"){
                res.render('users', {
                    name: `${user.first_name} ${user.last_name}`,
                    email: user.email,
                    role: user.role,
                    id: user._id,
                    premium: user.role === "premium",
                })
            } else {
                res.send("No autorizado")
            }
        } catch (error) {
            res.send(error)
        }
    }

    getUsers = async (req,res) => {
        try {
            const result = await UserModel.find().lean()
            const users = result.filter(user => user.role !== "admin")
            const session = new SessionDTO(req.session)
            const {role} = session
            if(role === "admin"){
                res.render('usersList', {
                    users: users,
                })
            } else {
                res.send("No autorizado")
            }
        } catch (error) {
            
        }
    }
    
}

export default new ViewsController()
