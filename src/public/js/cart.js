const emptyCartBtn = document.querySelector('#emptyCart')
const purchaseBtn = document.querySelector('#purchase')

emptyCartBtn.addEventListener('click', async () => {
    const user = await fetch('/api/sessions/current').then(res => res.json())
    await fetch(`/api/carts/${user.cart}`, {
        method: 'DELETE'
    }).finally(() => {
        location.reload()
    })
})

purchaseBtn.addEventListener('click', async () => {
    try {
        const user = await axios.get('http://localhost:8080/api/sessions/current');
        const ticketResponse = await axios.post(`http://localhost:8080/api/carts/${user.data.cart}/purchase`);

        const ticketData = ticketResponse

        if (ticketData.data.status === 'success' && ticketData.data.payload && ticketData.data.payload._id) {
            const ticketId = ticketData.data.payload._id;
            window.location.replace(location.origin + `/purchaseEnded/${ticketId}`);
        } else {
            console.error('Error al obtener el ID del ticket desde la respuesta del servidor:', ticketData);
        }
    } catch (error) {
        console.error('Error al realizar la operación:', error);
    }
});