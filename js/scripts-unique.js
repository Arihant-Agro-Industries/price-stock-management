
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
