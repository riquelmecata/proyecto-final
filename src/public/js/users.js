const deleteBtn = document.querySelector('#deleteUser')
const setUserBtn = document.querySelector('#setUser')
const setPremiumBtn = document.querySelector('#setPremium')
const userId = document.querySelector('#userId')

deleteBtn.addEventListener('click', async () => {
    try {
        await fetch(`/users/${userId.innerText}`, {
            method: 'DELETE'
        });

        // Mostrar SweetAlert con un mensaje y opción para redirigir
        Swal.fire({
            title: 'Usuario eliminado',
            text: '¿Quieres ir a la página de usuarios o volver al inicio?',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Ver todos los usuarios',
            cancelButtonText: 'Volver al inicio',
        }).then((result) => {
            if (result.isConfirmed) {
                // Redirigir a la página /users si se hace clic en "Ir a /users"
                window.location.href = '/usersList';
            } else {
                // Redirigir al inicio si se hace clic en "Volver al inicio"
                window.location.href = '/';
            }
        });
    } catch (error) {
        // Manejar cualquier error que pueda ocurrir durante la solicitud DELETE
        console.error('Error al eliminar usuario:', error);
        // Puedes mostrar un mensaje de error si lo deseas
        Swal.fire({
            title: 'Error',
            text: 'Hubo un error al eliminar el usuario. Por favor, inténtalo de nuevo.',
            icon: 'error',
        });
    }
});


if(setUserBtn) {
    setUserBtn.addEventListener('click', async () => {
        await fetch(`/users/premium/${userId.innerText}`,{
            method: 'POST'
        })
        .finally(() => {
            location.reload()
        })
    })
}

if(setPremiumBtn){
    setPremiumBtn.addEventListener('click', async () => {
        await fetch(`/users/premium/${userId.innerText}`,{
            method: 'POST'
        })
        .finally(() => {
            location.reload()
        })
    })
}