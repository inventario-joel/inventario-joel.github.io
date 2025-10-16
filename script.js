//  CONFIGURACIÓN DE VISUALIZACIÓN INICIAL 
const INITIAL_VISIBLE_ROWS = 15; // Define cuántas filas se verán al inicio.
let allProductsShown = false; // Bandera para saber si ya se han mostrado todos.
// 


//  Elementos del DOM 
const searchInput = document.getElementById('searchInput');
const productsTable = document.getElementById('productsTable');
const rows = productsTable.getElementsByTagName('tr'); // Obtiene todas las filas de la tabla
const tableBody = productsTable.querySelector('tbody');


//  LÓGICA DE CARGA INICIAL Y BOTÓN "VER MÁS" 

/**
 * Función para inicializar la vista de la tabla, mostrando solo las primeras N filas.
 */
function initializeProductView() {
    // Si la tabla tiene más filas que el límite, ocultamos el exceso
    if (rows.length - 1 > INITIAL_VISIBLE_ROWS) {
        // Empezamos desde la fila 1 (índice 1) para omitir el encabezado (índice 0)
        for (let i = INITIAL_VISIBLE_ROWS + 1; i < rows.length; i++) {
            rows[i].style.display = 'none';
        }
        
        // Añadir el botón "Ver Más"
        createShowMoreButton();
    }
}

/**
 * Crea y añade el botón para mostrar los productos ocultos.
 */
function createShowMoreButton() {
    const showMoreButton = document.createElement('button');
    showMoreButton.id = 'showMoreBtn';
    showMoreButton.textContent = `Mostrar todos (${rows.length - 1} productos)`;
    showMoreButton.style.display = 'block'; // Para que ocupe todo el ancho disponible si se desea estilizar
    showMoreButton.style.marginTop = '20px';
    showMoreButton.style.padding = '10px 15px';
    showMoreButton.style.backgroundColor = '#4CAF50'; // Un color verde para destacar
    showMoreButton.style.color = 'white';
    showMoreButton.style.border = 'none';
    showMoreButton.style.borderRadius = '8px';
    showMoreButton.style.cursor = 'pointer';
    showMoreButton.style.fontWeight = '600';
    showMoreButton.style.transition = 'background-color 0.3s ease';

    // Añadir el estilo hover
    showMoreButton.onmouseover = function() {
        this.style.backgroundColor = '#45a049';
    };
    showMoreButton.onmouseout = function() {
        this.style.backgroundColor = '#4CAF50';
    };
    
    // Insertar el botón justo después de la tabla
    productsTable.parentNode.insertBefore(showMoreButton, productsTable.nextSibling);

    showMoreButton.addEventListener('click', () => {
        // Mostrar todas las filas ocultas
        for (let i = INITIAL_VISIBLE_ROWS + 1; i < rows.length; i++) {
            rows[i].style.display = ''; // Usamos '' para que use el estilo por defecto (table-row)
        }
        showMoreButton.style.display = 'none'; // Ocultar el botón después de la acción
        allProductsShown = true;
    });
}

// Ejecutar la inicialización de la vista
initializeProductView();

//  Filtro de búsqueda (Sin cambios importantes) 
searchInput.addEventListener('keyup', function() {
    const filter = searchInput.value.toLowerCase();
    
    // Si hay un filtro, mostramos todas las filas para buscar en toda la lista.
    // Esto asegura que la búsqueda funcione en todos los productos, visibles u ocultos.
    const showMoreBtn = document.getElementById('showMoreBtn');
    if (filter.length > 0) {
        if (showMoreBtn) showMoreBtn.style.display = 'none';
    } else {
        // Si no hay filtro, volvemos al estado inicial si no se ha pulsado 'Ver Más'
        if (showMoreBtn && !allProductsShown) {
             showMoreBtn.style.display = 'block';
        }
    }


    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const productName = row.getElementsByTagName('td')[0].textContent.toLowerCase();

        // Lógica de filtrado
        if (productName.includes(filter)) {
            // Mostrar la fila si coincide con la búsqueda
            row.style.display = '';
        } else {
            // Ocultar la fila si no coincide
            row.style.display = 'none';
        }
        
        // **Ajuste para la carga inicial:** // Si no hay filtro y no se han mostrado todos, ocultar las filas más allá del límite
        if (filter.length === 0 && !allProductsShown && i > INITIAL_VISIBLE_ROWS) {
             row.style.display = 'none';
        }
    }
});


//  Cálculo del total (Sin cambios) 
const quantityInputs = document.querySelectorAll('.product-quantity');
const totalPriceElement = document.getElementById('totalPrice');

function calculateTotal() {
    let total = 0;
    quantityInputs.forEach(input => {
        const price = parseFloat(input.dataset.price);
        const quantity = parseInt(input.value);

        if (!isNaN(quantity) && quantity > 0) {
            total += price * quantity;
        }
    });

    totalPriceElement.textContent = `$${total.toFixed(2)}`;
}

quantityInputs.forEach(input => {
    input.addEventListener('change', calculateTotal);
    input.addEventListener('input', calculateTotal);
});

calculateTotal();

//  Apartado para editar precios (Sin cambios) 
const toggleEditButton = document.createElement('button');
toggleEditButton.textContent = "🔧 Editar precios";
toggleEditButton.style.marginBottom = "15px";
toggleEditButton.style.padding = "10px 15px";
toggleEditButton.style.backgroundColor = "#1E88E5";
toggleEditButton.style.color = "white";
toggleEditButton.style.border = "none";
toggleEditButton.style.borderRadius = "8px";
toggleEditButton.style.cursor = "pointer";
toggleEditButton.style.fontWeight = "600";
toggleEditButton.style.transition = "background-color 0.3s ease";

const container = document.querySelector('.container');
// Insertamos el botón de edición *después* del h2 pero *antes* de la tabla (y el botón de ver más)
container.insertBefore(toggleEditButton, container.querySelector('.total-container')); 

let editMode = false;

toggleEditButton.addEventListener('click', () => {
    editMode = !editMode;
    toggleEditButton.textContent = editMode ? "💾 Guardar precios" : "🔧 Editar precios";
    const priceCells = document.querySelectorAll('.price-cell');

    priceCells.forEach(cell => {
        const inputField = cell.querySelector('input');

        if (editMode) {
            const currentPrice = parseFloat(cell.textContent.replace('$', ''));
            cell.innerHTML = `<input type="number" step="0.01" min="0" value="${currentPrice}" class="edit-price" style="width:80px;text-align:center;">`;
        } else {
            const newPrice = parseFloat(cell.querySelector('input').value).toFixed(2);
            const row = cell.parentElement;
            const quantityInput = row.querySelector('.product-quantity');
            quantityInput.dataset.price = newPrice;
            cell.innerHTML = `$${newPrice}`;
        }
    });

    if (!editMode) calculateTotal();
});