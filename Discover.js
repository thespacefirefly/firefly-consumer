const fetch = require('node-fetch');

class Discover {

  constructor({servicesUrl}) {
    this.servicesUrl = servicesUrl
  }

  services() {
    return fetch(`${this.servicesUrl}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => response.json())
    .then(jsonData => jsonData)
  }

  servicesDetails() {
    return fetch(`${this.servicesUrl}/all/details`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => response.json())
    .then(jsonData => jsonData)
  }  

  operations({serviceKey}) {
    return fetch(`${this.servicesUrl}/${serviceKey}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => {
      return response.json()
    })
    .then(jsonData => {

      let operationsDetails = jsonData.operations
      let operationsList=[]
      let operations = {}

      operationsDetails.forEach(operation => {

        if(operation.method==="GET") {
          operation.run = function(...args) {
            //TODO: check size of args
            let params = args === undefined ? "" : args.join("/")
            return fetch(`${operation.url}/${params}`, {
              method: 'GET',
              headers: {
                "Content-Type": "application/json"
              }
            })
            .then(response => {
              return response.json()
            })
            .then(jsonData => jsonData)
          }
        }

        if(operation.method==="POST") {
          operation.run = function(args) {
            return fetch(`${operation.url}`, {
              method: 'POST',
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(args)
            })
            .then(response => {
              return response.json()
            })
            .then(jsonData => jsonData)
          }
        }     
        // TODO ⚠️ operation.name can't be equals to "list"
        // TODO ⚠️ operation.name can't be equals to "details"

        operationsList.push(operation.name)
        operations[operation.name] = operation.run 
      }) // end forEach
      operations.list = operationsList
      operations.details = operationsDetails
      return operations
    })  
  }

}

module.exports = Discover

/*
discover.services().then(services => {
  services.forEach(serviceKey => {
    discover.operations({serviceKey}).then(operations => {
      console.log(serviceName)
      console.log(operations)
      operations.temperature().then(data => console.log(data))
      operations.humidity().then(data => console.log(data))
    }).catch(error => console.log(error))
  })
})
*/