define({ "api": [
  {
    "type": "post",
    "url": "/event",
    "title": "",
    "group": "Event",
    "version": "0.1.0",
    "description": "<p>API to create a single event instance .</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Accept",
            "description": "<p>application/json.</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Token",
            "description": "<p>xxxxxxx.</p>"
          }
        ]
      }
    },
    "name": "CreateEvents",
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\n \"success\": \"true\",\n \"message\": \"events created successfully\",\n \"data\": []\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/controllers/doc-controllers/event.doc.js",
    "groupTitle": "Event"
  },
  {
    "type": "get",
    "url": "/event",
    "title": "",
    "group": "Event",
    "version": "0.1.0",
    "description": "<p>API to retrive events .</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Accept",
            "description": "<p>application/json.</p>"
          }
        ]
      }
    },
    "name": "GetEvents",
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\n \"success\": \"true\",\n \"message\": \"events reterived successfully\",\n \"data\": []\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/controllers/doc-controllers/event.doc.js",
    "groupTitle": "Event"
  }
] });
