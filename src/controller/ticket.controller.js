import TicketManager from "../DAL/dao/ticketManager.js";
import { UserModel } from "../DAL/db/models/user.model.js";
const Ticket = new TicketManager()

export const postTicket = async (req, res) => {
    const { cid } = req.params

    if (!cid) return res.status(400).json({ status: "error", error: "Cid must be provided by params" })

    try {
        const { ticket} = await Ticket.createTicket(cid)
        // Obtener el usuario actual
        const currentUser = await UserModel.findOne({ cart: cid });
        currentUser.tickets.push(ticket);
        await currentUser.save();
        return res.status(201).json({ status: "success", payload: ticket })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: "error", error: error.message })
    }
}