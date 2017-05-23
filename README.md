# FLASH BITACORA

Este proyecto es un test de los siguientes APIs de HTML5. 

- File
- Location
- Video
- Image
- Audio

Esta hecho con propósitos demostrativos. 

## Materialize

Se está usando materialize como framework de css. 

Para este caso estamos usando el componente Modal con el que, a través de formularios, vamos a obtener los datos de la publicación. 

Por ello encontrarás 

```JavaScript 
   $('.modal').modal(); // inicializa el modal
```
además de 
```JavaScript 
    // Inicializa y configura el datepicker para publicación de eventos.
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year
        onStart: () => {
            $('.picker').appendTo('body');
        }
    });
```

También las clases para formularios de Materialize que inclue `.input-field` y `.materialize-textarea`.


El elemento más llamativo termina siendo el _Fixed Action Button_ o **FAB**, que se ubica en la ezquina derecha de la vista y nos permite seleccionar el tipo de publicación. 

## JAVASCRIPT HTML5 File API

En el caso del File API, nos permite leer diferentes tipos de archivos. 

Para nuestro caso primero obtenemos el input de typo _file_ con el que pediremos los archivos al usuario. 
Una vez que tenemos el input, si es de tipo _file_ tendrá un arreglo de archivos que podemos obtener como  `inputFile.files`. Para nuestro caso solo usaremos el primer **archivo** que traiga. `inputFile.files[0]`. 

Con el primer archivo ya seleccionado, tendremos que definir cómo lo vamos a leer. Para ello, primero instanciamos un `FileReader`. 
```JavaScript 
var lector = new FileReader();
```
Un detalle importante es que para distintos ***tipos de archivos*** tenemos diferentes formas de leerlos. 

Para obtener el tipo de archivo usamos la propiedad `type` del mismo. 

En el código JavaScript de este proyecto encontrás la línea `switch(archivo.type)`, es decir, que vamos a ejecutar cierto flujo de código dependiendo de lo que llegue en la propiedad `type`. 

### IMAGES
Por ejemplo, para los **image**, los leeremos como una data de un Url que luego usaremos como source. Además indicamos cuál seria la función callback que será llamada una vez el archivo haya sido leído. 

En el caso de image: 
```JavaScript
  
  lector.readAsDataURL(archivo);
  lector.onload = readImage;

  //... 

    function readImage(evento){
      var image = new Image();
      image.src = evento.target.result;
      image.classList.add("image-responsive", "col", "s12");
      container.appendChild(image);
    }

``` 
Notarás que en `readImage` usamos el API Image, creamos una instancia y le asignamos como source el url obtenido luego de cargar el archivo. 

### AUDIO / VIDEO

Para el caso de leer archivos de audio y/o video, la lectura se hace de tipo ***buffer***. Es decir, cargamos los archivos serializados en memoria. 

```JavaScript 
  lector.readAsArrayBuffer(archivo);
```

Dependiendo de si es audio o video, deberemos usar diferentes funciones callback.
En el caso de video se verá como: 
```JavaScript
  lector.onload = readVideo; // video
  // ... 
  function readVideo(encodedfile){
        var video = document.createElement("video");
        video.setAttribute("src", URL.createObjectURL(archivo));
        video.controls = true;
        result = video;
        container.appendChild(video);
    }
```
Aquí usamos el API de Video para cargarlo. 

En caso de Audio, también usando el API de Audio. 
```JavaScript
  lector.onload = readAudio; // video
  // ... 
    function readAudio(encodedfile){
        var audio = new Audio();
        audio.setAttribute("src", URL.createObjectURL(archivo));
        audio.controls = true;
        result = audio;
        container.appendChild(audio);
    }
```

En la función `loadFiles`  encontrarás otras formas de leer y renderizar archivos, puede que como texto, o incluso como HTML. 


## JAVASCRIPT HTML5 Location API

Para el caso de la localización, por ejemplo, al publicar un evento, publicamos donde sucedió, para nuestro caso, nuestra localización actual. Se puede obtener la localización actual usando: 

```JavaScript
    navigator.geolocation.getCurrentPosition(initMap)
```
Notarás un `initMap`, es la función callback a la que llamará el API cuando allá podido determinar la localización actual. 
No tiene mucho sentido obtener la localización si no vamos a hacer nada con ella, en nuestro caso vamos a mostrarla usando google maps. 

### Google MAPS
Vamos a usar el API de Google Maps para mostrar la localización en el mapa. Para ello agregamos un script a nuestro HTML 
```HTML
    <script async defer src="https://maps.googleapis.com/maps/api/js?key=API_KEY"></script>
```
Donde `API_KEY` debes reemplazarlo por un API key propio que puedes obtener en la [página de google developers](https://developers.google.com/maps/documentation/javascript/get-api-key).

Luego, en nuestro código, en el callback `initMap` llamaremos al API:

```JavaScript
    function initMap(position) {
      var currentlocation = {lat: position.coords.latitude, lng: position.coords.longitude};
      var map = new google.maps.Map(document.getElementById('map-'+id), {
        zoom: 16,
        center: currentlocation
      });
      var marker = new google.maps.Marker({
        position: currentlocation,
        map: map
      });
    }
```

Este código tiene espacio de mejora, debido a que ese **id** generado no es realmente un id único. 


## Objeto Card
Esto es un poco de programación Orientada a Objetos. Para nuestro caso, cada publicación va a generar una tarjeta. Pero la tarjeta es la que sabe como va a agregar campos a su contenido. Las funciones de publicación no tendrían porque decirle cómo crearse, pero si indicarle cuándo necesitan que este creada y que campos requieren. 

Nuestro objeto Card, tendrá que saber de que tipo es:

```JavaScript 
function Card(type){
    this.type = type;
    // crea el contenido de la tarjeta
    this.content = document.createElement("DIV"); 
    this.content.classList.add("card-panel", "hoverable");
    this.content.draggable = true;

    // agregar el título de la tarjeta
    this.addTitle = (type) => {
      let title = document.getElementById("modal-"+this.type+"-title").value;
      let titleLabel = document.createElement("H3");
      titleLabel.appendChild(document.createTextNode(title));
      this.content.appendChild(titleLabel);
		  this.title = title;
    }

    // agregar la fecha de la tarjeta
    this.addDate = () => {
      let date = document.getElementById("modal-"+this.type+"-date").value;
      let dateLabel = document.createElement("P");
      dateLabel.appendChild(document.createTextNode(date));
      this.content.appendChild(dateLabel);
    }

    /**
    * 
    * @field : info to be deploy. Required
    * @element : html element, by defaul p
    * @clases: classes to be added, by defaul none
    */
    this.addField = (...arguments) => {
      if(arguments.length < 1) return null; 

      let text = (document.getElementById("modal-"+this.type+"-"+arguments[0]) && document.getElementById("modal-"+this.type+"-"+arguments[0]).value) || arguments[0];		
      
      let element = document.createElement(arguments[1] || "P");
      element.appendChild(document.createTextNode(text));
      
      if(arguments.length >= 2) {
        for(let i = 2; i<arguments.length; i++ ){
          typeof arguments[i] === "string" && element.classList.add(arguments[i]);
        }
      }

      this.content.appendChild(element);
    }
}
```

La funcien `addField` nos permitirá agregar diferentes tipos de campos de acuerdo a lo que requiramos. 

1. Recibe un primer parámetro que seria el contenido o el id del field donde se encontrará el cotenido.
2. Recibe el tag de element HTML en el que irá ese contenido. 
3. Recibe las clases que tendrá dicho tag. 

Como no sabemos cuantos *parámetros* tendremos, usamos `...args`.

### Objeto Arguments vs Rest Parameters 
El [objeto arguments](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/arguments) nos trae una lista donde estan todos los parámetros que han sido pasados a una función. Tiene todas las características de un arreglo, excepto por el `length`. Anteriormente teníamos que pasar/converitr este objeto a un array:

```JavaScript
var args = Array.prototype.slice.call(arguments);
```

En ES6 puedes usar `...arguments` que son [Rest Parameters](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/rest_parameters) donde tendremos un número indefinido de parámetros. 

Es diferente usar uno u otro ya que:
 - Arguments  trae todos los parámetros pasados a la función. 
 - Rest parameters en cambio lista todos los parámetros que en la definición de la función no tienen nombre. 

 Por ejemplo, si tenemos la función:
 ```JavaScript
 function mifuncion(a, b, c){
  ...
 }

 mifuncion("a", "b", "c", "d")
 ```
Para esta función el `objeto arguments` traerá todos los parámetros `["a", "b", "c", "d"]`. En cambio el `rest parameters` no existe. 

Para el caso de la función: 
 ```JavaScript
 function mifuncion2(a, b, ...args){
  ...
 }

 mifuncion2("a", "b", "c", "d")
 ```

 En la función 2, el `objeto arguments` traerá todos los parámetros `["a", "b", "c", "d"]` y el `rest parameters` traerá `["c", "d"]`.
