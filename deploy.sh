# Configure storage to host static apps
# az storage blob service-properties update --account-name hackthejourneyfrontend --static-website --404-document index.html --index-document index.html
cd app

npm run build

az storage blob upload-batch -s build -d \$web --account-name hackthejourneyfrontend
# Show link
az storage account show -n hackthejourneyfrontend -g hackthejourney --query "primaryEndpoints.web" --output tsv
