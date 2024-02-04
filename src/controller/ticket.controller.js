import TicketManager from "../DAL/dao/ticketManager.js";
import { UserModel } from "../DAL/db/models/user.model.js";
import { transporter } from "../config/nodemailerConfig.js";

const Ticket = new TicketManager();

export const postTicket = async (req, res) => {
    const { cid } = req.params;

    if (!cid) return res.status(400).json({ status: "error", error: "Cid must be provided by params" });

    try {
        const { ticket } = await Ticket.createTicket(cid);

        // Obtener el usuario actual
        const currentUser = await UserModel.findOne({ cart: cid });
        console.log(currentUser);

        currentUser.tickets.push(ticket);
        await currentUser.save();

        // Enviar el correo electrónico
        const mailOptions = {
            from: `"Prueba" <riquelmecata@gmail.com>`,
            to: currentUser.email,
            subject: 'Compra realizada con éxito',
            template: 'emailTicket'
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error al enviar el correo electrónico:', error);
                return res.status(500).json({ status: 'error', error: 'Error al enviar el correo electrónico' });
            }
        
            console.log('Correo electrónico enviado correctamente:', info);
            return res.status(201).json({ status: "success", payload: ticket });
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "error", error: error.message });
    }
};