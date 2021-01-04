# Create new document
curl -X POST http://localhost:9191/document -H "content-type: application/json" -d '{ "category": "X1", "owner": "123456789012345678901234"  }'


# Add new meta data
# Replace $DOC_ID with previouse doc-id
curl -X POST http://localhost:9191/document/$DOC_ID/meta -H "content-type: application/json" -d '{ "key": "code", "value": 100100, "createdBy": "5fe9ab1f0a23f4af12071ca5" }'

# Updatemeta data
# Replace $DOC_ID with previouse doc-id
# Replace $META_ID with previouse doc-id
curl -X PATCH http://localhost:9191/document/$DOC_ID/meta/$META_ID -H "content-type: application/json" -d '{ "key": "code", "value": 200100, "createdBy": "5fe9ab1f0a23f4af12071ca5" }'
