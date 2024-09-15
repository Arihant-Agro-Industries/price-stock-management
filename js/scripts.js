
document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('arihant-table').getElementsByTagName('tbody')[0];
    const manageButton = document.getElementById('manage-product');
    const modal = document.getElementById('product-modal');
    const closeModal = document.getElementsByClassName('close')[0];
    const form = document.getElementById('product-form');
    const modalTitle = document.getElementById('modal-title');
    let isEditing = false;
    let editRowIndex = null;

    // Load data from local storage
    loadTableData();

    manageButton.addEventListener('click', () => {
        openModal('Add Product');
    });

    closeModal.addEventListener('click', () => {
        closeModalDialog();
    });

    window.onclick = function(event) {
        if (event.target == modal) {
            closeModalDialog();
        }
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const productName = document.getElementById('product-name').value;
        const stock = document.getElementById('stock').value;
        const salePrice = document.getElementById('sale-price').value;
        const lastUpdate = new Date().toLocaleString();

        if (isEditing) {
            updateRow(editRowIndex, productName, stock, salePrice, lastUpdate);
        } else {
            addRow(productName, stock, salePrice, lastUpdate);
        }

        closeModalDialog();
        saveTableData();
        updateSerialNumbers();
    });

    function openModal(title) {
        modalTitle.textContent = title;
        modal.style.display = 'block';
    }

    function closeModalDialog() {
        modal.style.display = 'none';
        form.reset();
        isEditing = false;
        editRowIndex = null;
    }

    function addRow(productName, stock, salePrice, lastUpdate) {
        const newRow = table.insertRow();
        newRow.innerHTML = `
            <td></td>
            <td>${productName}</td>
            <td>${stock}</td>
            <td>${salePrice}</td>
            <td>${lastUpdate}</td>
            <td>
                <button onclick="editRow(this)" class="button">Edit</button>
                <button onclick="deleteRow(this)" class="button">Delete</button>
            </td>
        `;
    }

    window.editRow = function(button) {
        const row = button.parentNode.parentNode;
        editRowIndex = row.rowIndex - 1;
        document.getElementById('product-name').value = row.cells[1].innerText;
        document.getElementById('stock').value = row.cells[2].innerText;
        document.getElementById('sale-price').value = row.cells[3].innerText;
        isEditing = true;
        openModal('Edit Product');
    };

    function updateRow(index, productName, stock, salePrice, lastUpdate) {
        const row = table.rows[index];
        row.cells[1].innerText = productName;
        row.cells[2].innerText = stock;
        row.cells[3].innerText = salePrice;
        row.cells[4].innerText = lastUpdate;
    }

    window.deleteRow = function(button) {
        const row = button.parentNode.parentNode;
        table.deleteRow(row.rowIndex - 1);
        saveTableData();
        updateSerialNumbers();
    };

    function saveTableData() {
        const rows = table.rows;
        const data = [];
        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].cells;
            const rowData = {
                productName: cells[1].innerText,
                stock: cells[2].innerText,
                salePrice: cells[3].innerText,
                lastUpdate: cells[4].innerText
            };
            data.push(rowData);
        }
        localStorage.setItem('arihantTableData', JSON.stringify(data));
    }

    function loadTableData() {
        const data = JSON.parse(localStorage.getItem('arihantTableData')) || [];
        data.forEach(rowData => {
            addRow(rowData.productName, rowData.stock, rowData.salePrice, rowData.lastUpdate);
        });
        updateSerialNumbers();
    }

    function updateSerialNumbers() {
        const rows = table.rows;
        for (let i = 0; i < rows.length; i++) {
            rows[i].cells[0].innerText = i + 1;
        }
    }
});
