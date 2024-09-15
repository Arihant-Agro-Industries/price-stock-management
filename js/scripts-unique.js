document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('unique-table').getElementsByTagName('tbody')[0];
    const manageButton = document.getElementById('manage-product-unique');
    const modal = document.getElementById('product-modal-unique');
    const closeModal = document.getElementsByClassName('close-unique')[0];
    const form = document.getElementById('product-form-unique');
    const modalTitle = document.getElementById('modal-title-unique');
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
        const productName = document.getElementById('product-name-unique').value;
        const brand = document.getElementById('brand-unique').value;
        const salePrice = document.getElementById('sale-price-unique').value;
        const stock = document.getElementById('stock-unique').value;
        const lastUpdate = new Date().toLocaleString();

        if (isEditing) {
            updateRow(editRowIndex, productName, brand, salePrice, stock, lastUpdate);
        } else {
            addRow(productName, brand, salePrice, stock, lastUpdate);
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

    function addRow(productName, brand, salePrice, stock, lastUpdate) {
        const newRow = table.insertRow();
        newRow.innerHTML = `
            <td></td>
            <td>${productName}</td>
            <td>${brand}</td>
            <td>${salePrice}</td>
            <td>${stock}</td>
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
        document.getElementById('product-name-unique').value = row.cells[1].innerText;
        document.getElementById('brand-unique').value = row.cells[2].innerText;
        document.getElementById('sale-price-unique').value = row.cells[3].innerText;
        document.getElementById('stock-unique').value = row.cells[4].innerText;
        isEditing = true;
        openModal('Edit Product');
    };

    function updateRow(index, productName, brand, salePrice, stock, lastUpdate) {
        const row = table.rows[index];
        row.cells[1].innerText = productName;
        row.cells[2].innerText = brand;
        row.cells[3].innerText = salePrice;
        row.cells[4].innerText = stock;
        row.cells[5].innerText = lastUpdate;
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
                brand: cells[2].innerText,
                salePrice: cells[3].innerText,
                stock: cells[4].innerText,
                lastUpdate: cells[5].innerText
            };
            data.push(rowData);
        }
        localStorage.setItem('uniqueTableData', JSON.stringify(data));
    }

    function loadTableData() {
        const data = JSON.parse(localStorage.getItem('uniqueTableData')) || [];
        data.forEach(rowData => {
            addRow(rowData.productName, rowData.brand, rowData.salePrice, rowData.stock, rowData.lastUpdate);
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
