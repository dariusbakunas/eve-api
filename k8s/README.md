# Deploying

Create `secrets.env` under overlays/[staging|production], with these variables set:

```dotenv
AUTH0_DOMAIN=
AUTH0_AUDIENCE=
DB_HOST=
DB_NAME=
DB_USER=
DB_PASSWORD=
EVE_CLIENT_ID=
EVE_CLIENT_SECRET=
TOKEN_SECRET=
```

Deploy:

```bash
# staging:
kustomize build overlays/staging | kubectl apply -f -

# production
kustomize build overlays/production | kubectl apply -f -
```

or

```bash
# staging:
kustomize build overlays/staging > staging.yaml
kubectl apply -f ./staging.yaml
```
