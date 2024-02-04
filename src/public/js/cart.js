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
        const user = await fetch('/api/sessions/current').then(res => res.json());
        const ticketResponse = await fetch(`/api/carts/${user.cart}/purchase`, {
            method: 'POST'
        });
        
        const ticketData = await ticketResponse.json();

        if (ticketData.status === 'success' && ticketData.payload && ticketData.payload._id) {
            const ticketId = ticketData.payload._id;
            window.location.replace(location.origin + `/purchaseEnded/${ticketId}`);
        } else {
            console.error('Error al obtener el ID del ticket desde la respuesta del servidor:', ticketData);
        }
    } catch (error) {
        console.error('Error al realizar la operación:', error);
    }
});