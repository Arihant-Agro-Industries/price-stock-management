document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('unique-table').getElementsByTagName('tbody')[0];
    const manageButton = document.getElementById('manage-product-unique');
    const modal = document.getElementById('product-modal-unique');
    const closeModal = document.getElementsByClassName('close-unique')[0];
    const form = document.getElementById('product-form-unique');  // Make sure this ID is correct
    const modalTitle = document.getElementById('modal-title-unique');
    let isEditing = false;
    let editRowIndex = null;

    // Load existing data from local storage
    loadTableData();

    // Open modal to add a new product
    manageButton.addEventListener('click', () => {
        openModal('Add Product');
    });

    // Close modal when clicking on the close button
    closeModal.addEventListener('click', () => {
        closeModalDialog();
    });

    // Close modal when clicking outside of the modal
    window.onclick = function(event) {
        if (event.target == modal) {
            closeModalDialog();
        }
    };

    // Handle form submission for adding/editing products
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        // Get the form values
        const productName = document.getElementById('product-name-unique').value;
        const brand = document.getElementById('brand-unique').value;
        const salePrice = document.getElementById('sale-price-unique').value;
        const stock = document.getElementById('stock-unique').value;
        const lastUpdate = new Date().toLocaleString();

        // Add or update row based on whether editing
        if (isEditing) {
            updateRow(editRowIndex, productName, brand, salePrice, stock, lastUpdate);
        } else {
            addRow(productName, brand, salePrice, stock, lastUpdate);
        }

        // Close the modal and reset form
        closeModalDialog();

        // Save the table data to local storage
        saveTableData();

        // Update the serial numbers in the table
        updateSerialNumbers();
    });

    // Function to open the modal
    function openModal(title) {
        modalTitle.textContent = title;
        modal.style.display = 'block';
    }

    // Function to close the modal and reset form
    function closeModalDialog() {
        modal.style.display = 'none';
        form.reset();
        isEditing = false;
        editRowIndex = null;
    }

    // Function to add a new row to the table
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

    // Edit existing row
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

    // Update existing row
    function updateRow(index, productName, brand, salePrice, stock, lastUpdate) {
        const row = table.rows[index];
        row.cells[1].innerText = productName;
        row.cells[2].innerText = brand;
        row.cells[3].innerText = salePrice;
        row.cells[4].innerText = stock;
        row.cells[5].innerText = lastUpdate;
    }

    // Delete row
    window.deleteRow = function(button) {
        const row = button.parentNode.parentNode;
        table.deleteRow(row.rowIndex - 1);
        saveTableData();
        updateSerialNumbers();
    };

    // Save table data to local storage
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

    // Load table data from local storage
    function loadTableData() {
        const data = JSON.parse(localStorage.getItem('uniqueTableData')) || [];
        data.forEach(rowData => {
            addRow(rowData.productName, rowData.brand, rowData.salePrice, rowData.stock, rowData.lastUpdate);
        });
        updateSerialNumbers();
    }

    // Update serial numbers for each row
    function updateSerialNumbers() {
        const rows = table.rows;
        for (let i = 0; i < rows.length; i++) {
            rows[i].cells[0].innerText = i + 1;
        }
    }
});
