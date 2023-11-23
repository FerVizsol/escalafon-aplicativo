const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const itemDetails = document.getElementById('itemDetails');

searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value;

  // Make an AJAX request to your Express.js server to fetch search results
  fetch(`/search?term=${searchTerm}`)
    .then((response) => response.json())
    .then((data) => {
      // Clear previous search results
      searchResults.innerHTML = '';
      
      // Toggle the visibility of the custom dropdown
      if (data.length > 0) {
        searchResults.style.display = 'block';
      } else {
        searchResults.style.display = 'none';
      }

      data.forEach((result) => {
        // Create list item for each result
        const resultItem = document.createElement('li');
        resultItem.textContent = result.codRuc;

        // Attach click event to show item details
        resultItem.addEventListener('click', () => {
          showItemDetails(result.codRuc);
          searchResults.style.display = 'none'; // Hide custom dropdown on selection
        });

        searchResults.appendChild(resultItem);
      });
    });
});

// Function to show item details
function showItemDetails(codRuc) {
  // Make another AJAX request to get details based on codRuc
  fetch(`/getItemDetails?codRuc=${codRuc}`)
    .then((response) => response.json())
    .then((data) => {
      // Clear previous item details
      itemDetails.innerHTML = '';

      // Create a container for the details
      const detailsContainer = document.createElement('div');
      detailsContainer.classList.add('row'); // Add Bootstrap row class

      // Iterate through the properties of the data object
      for (const property in data) {
        if (data.hasOwnProperty(property)) {
          // Generate a unique ID for the input based on the property name
          const inputId = `${property.toLowerCase()}Input`;

          // Create a div for each property with a column width of 6 (half the width)
          const colElement = document.createElement('div');
          colElement.classList.add('col-md-6'); // Add Bootstrap column class

          // Create an input element for the property with the generated ID
          const inputElement = document.createElement('input');
          inputElement.type = 'text';
          inputElement.value = data[property];
          inputElement.disabled = true; // Make it disabled
          inputElement.classList.add('form-control'); // Add Bootstrap class
          inputElement.id = inputId; // Assign the generated ID

          // Create a label for the input with the "for" attribute pointing to the input's ID
          const labelElement = document.createElement('label');
          labelElement.textContent = `${property}: `;
          labelElement.classList.add('form-label'); // Add Bootstrap class
          labelElement.setAttribute('for', inputId); // Set the "for" attribute

          // Append the label and input to the column
          colElement.appendChild(labelElement);
          colElement.appendChild(inputElement);

          // Append the column to the details container
          detailsContainer.appendChild(colElement);

          // Add a line break between properties (if needed)
          detailsContainer.appendChild(document.createElement('br'));
        }
      }
      // Display the details container in the itemDetails element
      itemDetails.appendChild(detailsContainer);
    });
}




const searchProductoInput = document.getElementById('searchProductoInput');
const searchProductoResults = document.getElementById('searchProductoResults');
const productoDetails = document.getElementById('productoDetails');

searchProductoInput.addEventListener('input', () => {
  const searchTerm = searchProductoInput.value;

  // Make an AJAX request to your Express.js server to fetch producto results
  fetch(`/searchProducto?term=${searchTerm}`)
    .then((response) => response.json())
    .then((data) => {
      // Clear previous producto search results
      searchProductoResults.innerHTML = '';
      
      // Toggle the visibility of the custom dropdown
      if (data.length > 0) {
        searchProductoResults.style.display = 'block';
      } else {
        searchProductoResults.style.display = 'none';
      }

      data.forEach((producto) => {
        // Create a list item for each producto
        const productoItem = document.createElement('li');
        productoItem.textContent = `${producto.codProducto} - ${producto.nombre}`;
        
        // Attach click event to show producto details
        productoItem.addEventListener('click', () => {
          showProductoDetails(producto);
          searchProductoResults.style.display = 'none'; // Hide custom dropdown on selection
        });

        searchProductoResults.appendChild(productoItem);
      });
    });
});

function showProductoDetails(producto) {
  // Clear previous producto details
  productoDetails.innerHTML = '';

  // Create a container for the details
  const detailsContainer = document.createElement('div');
  productoDetails.style.display = 'block';

  // Iterate through the properties of the producto object
  for (const property in producto) {
    if (producto.hasOwnProperty(property)) {
      if (property === 'afectaIgv') {
        // Create a label for the "afectaIgv" property
        const labelElement = document.createElement('label');
        labelElement.textContent = `${property}: `;
        labelElement.classList.add('form-label'); // Add Bootstrap class

        // Append the label to the details container
        detailsContainer.appendChild(labelElement);

        // Create a button element for "afectaIgv"
        const buttonElement = document.createElement('button');
        buttonElement.type = 'button';
        buttonElement.classList.add('btn');

        // Set the button's text and style based on producto[property]
        if (producto[property] === 1) {
          buttonElement.textContent = 'Si';
          buttonElement.classList.add('btn-success');
        } else {
          buttonElement.textContent = 'No';
          buttonElement.classList.add('btn-warning');
        }

        // Append the button to the details container
        detailsContainer.appendChild(buttonElement);
      } else {
        // Create an input element for other properties
        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.value = producto[property];
        inputElement.disabled = true; // Make it disabled
        inputElement.classList.add('form-control'); // Add Bootstrap class

        // Generate a unique ID for the input based on the property name
        const inputId = `${property}Input`;
        inputElement.id = inputId;

        // Create a label for the input
        const labelElement = document.createElement('label');
        labelElement.textContent = `${property}: `;
        labelElement.classList.add('form-label'); // Add Bootstrap class
        labelElement.setAttribute('for', inputId); // Set the "for" attribute to link to the input

        // Append the label and input to the details container
        detailsContainer.appendChild(labelElement);
        detailsContainer.appendChild(inputElement);
      }

      // Add a line break between properties
      detailsContainer.appendChild(document.createElement('br'));
    }
  }

  // Display the details container in the productoDetails element
  productoDetails.appendChild(detailsContainer);
}



//* INGRESAR A LA LISTA EL PRODUCTO*/
// ... Your existing code ...
let agravadasum = 0;
let igvsum = 0;
let opexonerada = 0;
let importetotal = 0;
agregarProductoButton.addEventListener('click', async () => {
  // Get the values you want to add to the table
  productoDetails.style.display = 'none';
  const itemNumber = document.getElementById("codProductoInput").value; // Replace with the actual product code
  const nombre = document.getElementById("nombreInput").value; // Replace with the actual product name
  const cantidad = parseFloat(cantidadInput.value); // Get the quantity from the input
  if (isNaN(cantidad) || cantidad <= 0) {
    return;
  }
  const costoUnitario = parseFloat(document.getElementById("costoUnitarioInput").value); // Replace with the actual unit price
  const total = cantidad * costoUnitario; // Calculate the total

  // Fetch igvDecimal based on tipoIgv from the /getIgvDecimal endpoint
  const tipoIgv = document.getElementById('tipoIgvInput').value; // Replace with the actual tipoIgv value

  try {
    const response = await fetch(`/getIgvDecimal?tipoIgv=${tipoIgv}`);
    if (!response.ok) {
      // Handle the case where tipoIgv was not found or there was an error
      console.error('Error fetching igvDecimal:', response.status);
      // You can show an error message or take appropriate action.
      return;
    }
    const data = await response.json();
    let igvDecimal = data.igvDecimal;

    // Calculate afectoIgv based on igvDecimal and total
    const afectoIgv = total * igvDecimal;

    // Create a new table row
    const newRow = document.createElement('tr');

    // Populate the row with data
    newRow.innerHTML = `
      <td>${itemNumber}</td>
      <td>${nombre}</td>
      <td>${cantidad}</td>
      <td>${costoUnitario}</td>
      <td>${total}</td>
      <td>${afectoIgv}</td>
    `;
    if(afectoIgv > 0){
      agravadasum += total;
      igvsum += afectoIgv;
      document.getElementById("opagravada-sum").textContent = agravadasum;
      document.getElementById("igv-sum").textContent = igvsum; 
      importetotal = importetotal + total + afectoIgv;
      document.getElementById("importetotal").textContent = importetotal;
    }else{
      opexonerada += total;
      document.getElementById("op-exoneradosum").textContent = opexonerada;
      importetotal += total;
      document.getElementById("importetotal").textContent = importetotal;
    }
    // Append the row to the table
    productList.appendChild(newRow);

    // Reset the input field
    cantidadInput.value = '';
  } catch (error) {
    console.error('Error fetching igvDecimal:', error);
    // Handle fetch errors
    // You can show an error message or take appropriate action.
  }
});

function validateRedireccion(){
  try{
    var selectedVendedor = document.getElementById("vendedor");
    console.log(selectedVendedor.value.split(' - ')[0])
    var selectedPun = document.getElementById("puntoVenta");
    console.log(selectedPun.value.split(' - ')[0])
    var selectedClient = document.getElementById("codrucInput");
    console.log(selectedClient.value);
    var table = document.getElementById("tablaProductos");
    var numFilas = table.rows.length;
    console.log(numFilas)
    if(selectedVendedor.value != '' && selectedPun.value != '' && selectedClient.value != '' && numFilas>1){
      crearFactura(parseInt(selectedVendedor.value.split(' - ')[0]),parseInt(selectedPun.value.split(' - ')[0]),parseInt(selectedClient.value));
    }
  }catch(err){
    console.log(err)
    alert("Faltan Datos");
  }
}
crearfactura.addEventListener('click',validateRedireccion);

function crearFactura(codVendedor, codPun, codClient) {
  // Fetch the numFacturas value
  fetch('/getNumFacturas')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error fetching numFacturas: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const numFacturas = data.numFacturas;
      const codFactura = `F${1000 + (parseInt(numFacturas) + 1)}`;
      const codEmpresa = 1;
      const fecha = formatDateToCustomString(new Date());
      const costoTotal = parseFloat(document.getElementById('importetotal').textContent);
      const codEstado = 'R';

      // Construct the INSERT query
      const insertQuery = `
        INSERT INTO factura (codFactura, codEmpresa, codVendedor, codPuntoVenta, codCliente, fecha_emision, costoTotal, codEstado)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
      `;

      const valuesA = [
        codFactura,
        codEmpresa,
        codVendedor,
        codPun,
        codClient,
        fecha,
        costoTotal,
        codEstado,
      ];
      const requestBody = {
        "query": insertQuery,
        "values": valuesA
      };
      console.log(valuesA)
      // Execute the INSERT query
      fetch('/insertFactura', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"query": insertQuery, "values": valuesA}),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error inserting factura: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log('Factura inserted successfully:', data.message);
          createDetallesFactura(codFactura);
        })
        .catch((error) => {
          console.error('Error inserting factura:', error);
          // Handle the error as needed
        });
    })
    .catch((error) => {
      console.error(error.message);
      // Handle the error as needed
    });
}

function createDetallesFactura(codFactura){
  //insert into detalle_factura values (codFactura,codProducto,cantidadComprada,costoSubTotal,costoIGV);
  var table = document.getElementById("tablaProductos");
    var numFilas = table.rows.length;
    console.log(numFilas)
    for (var i = 1; i < numFilas; i++) {
    console.log('Loop Iteration:', i);
    var row= table.rows[i];
    var cells = row.cells;
    console.log(cells[0].textContent);
    var codProducto = cells[0].textContent;
    var cantidadComprada = cells[2].textContent;
    var costoSubTotal = cells[4].textContent;
    var costoIGV = cells[5].textContent;
    const insertQuery = `
        INSERT INTO detalle_factura(codFactura,codProducto,cantidadComprada,costoSubTotal,costoIGV) values (?,?,?,?,?);
      `;
    const valuesA =[
      codFactura,
      parseInt(codProducto),
      parseInt(cantidadComprada),
      parseFloat(costoSubTotal),
      parseFloat(costoIGV)
    ]
    console.log({"query":insertQuery,"values":valuesA});
    fetch('/insertFactura',{
      method : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"query":insertQuery,"values":valuesA}),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`Error inserting factura: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log('Detalle Factura inserted successfully:', data.message);
      alert("FACTURA REGISTRADA");
      // Redirect to another page in the current tab
      window.location.replace('http://127.0.0.1:3000/');

    })
    .catch((error) => {
      console.error('Error inserting detalle_factura:', error);
      // Handle the error as needed
    });
  }
}

function formatDateToCustomString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}