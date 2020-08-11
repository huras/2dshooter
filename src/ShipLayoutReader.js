class ShipLayoutReader {
  constructor() {
    this.animationCounter = 0;
    this.hasLoaded = false;
  }

  async load(filepath, callback = undefined) {
    this.filepath = filepath;
    this.read(callback);
  }

  getTilesetByGID(gid) {
    let retorno = null;
    this.tilesets.map((tileset) => {
      // console.log(gid, tileset.firstgid <= gid, gid <= tileset.firstgid + (tileset.tilecount - 1), tileset);      
      if (tileset.imageLoaded) {
        if (
          tileset.firstgid <= gid &&
          gid <= tileset.firstgid + (tileset.tilecount - 1)
        ) {
          retorno = tileset;
        }
      }
    });

    return retorno;
  }

  getLayerByZIndex(zIndex) {
    let retorno = null;
    this.layers.map((layer) => {
      if (this.layers.properties['z-index'] == zIndex)
        retorno = layer;
    });

    return retorno;
  }

  getProperties(objectToAttach) {
    var properties = [];
    var propertyTags = objectToAttach.querySelector('properties');
    if (propertyTags) {
      propertyTags = propertyTags.querySelectorAll('property')
    } else {
      propertyTags = [];
    }

    for (var propTag of propertyTags) {
      const key = propTag.getAttribute("name");
      const value = JSON.parse(propTag.getAttribute("value"));
      properties[key] = value;
    }
    return properties;
  }

  getObjects(objectgroup) {

  }

  async read(callback = undefined) {
    // For reading .txt file code block
    TxtReader.loadTextFile(this.filepath, (fileString) => {

      var parser, xmlDoc;

      parser = new DOMParser();
      xmlDoc = parser.parseFromString(fileString, "text/xml");

      // Read Stages
      this.challenges = [];
      this.questions = [];
      for (var objectgroup of xmlDoc.querySelectorAll("objectgroup")) {
        var newStage = {
          name: null,
          objects: []
        };

        newStage.name = objectgroup.getAttribute('name');
        newStage.properties = this.getProperties(objectgroup);

        for (var object of objectgroup.querySelectorAll("object")) {
          var tempType = object.getAttribute("type");
          var tempX = parseInt(object.getAttribute("x"));
          var tempY = parseInt(object.getAttribute("y"));
          var tempW = parseInt(object.getAttribute("width"));
          var tempH = parseInt(object.getAttribute("height"));

          var newObject = {
            gid: parseInt(object.getAttribute("gid")),
            type: tempType,
            x: tempX + tempW * 0.5,
            y: 1600 - tempY,
            w: tempW,
            h: tempH,
            name: object.getAttribute("name"),
            // collider: newPolyColider,
            properties: this.getProperties(object)
          };

          newStage.objects.push(newObject);
        }

        switch (newStage.properties.type) {
          case 'challenge':
            this.challenges.push(newStage);
            break;

          case 'question':
            this.questions.push(newStage);
            break;

          default:
            break;
        }
      }

      this.hasLoaded = true;
      if (callback)
        callback();

      // console.log(this.layers);
      // console.log(xmlDoc);
    });
  }
}