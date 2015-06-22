# hobo-api

Hobo

# Requirements

1. Install gcloud tool
2. Install app engine SDK

# Running Locally

```
goapp serve -host 0.0.0.0 -port 8080 -admin_port 8000 app/app-staging.yaml
```

# Deploy to AppEngine

1. Login:

	```
	gcloud auth login
	```
	
2. Deploy to AppEngine

	```
	goapp deploy -application staging-api-getunseen app/app-<environment>.yaml
	```

3. Query the Datastore you have to use the namespace 'hobo'
[Click here:](http://localhost:8000/datastore?kind=Account&namespace=hobo) 
	```
	http://localhost:8000/datastore?kind=Account&namespace=hobo
	```

# Snap CI

Snap CI pipeline uses the scripts under `bin` to configure `go` environment and automatically performs the following steps:

1. Build the project resolving dependencies with `goapp get ...` and run any tests in the project.
2. Deploys the app to `Staging` environment in `AppEngine` using the tool `appcfg.py` in the appengine SDK.

There is a manual step to deploy the build resulted from the previous steps in to `production` environment in `AppEngine`.

# AppEngine Modules and Namespaces

AppEngine allows developers to build multitenancy applications by applying namespaces to their data.

Some of the APIs supporting `Namespaces` are: `Datastore`, `memcache`, `taskqueue`.

Exemple of `Namespace` usage with `Datastore`:

```golang
gae := appengine.NewContext(c.Request)
gaeNamespace := appengine.ModuleName(gae)
namespacedContext, _ := appengine.Namespace(gae, gaeNamespace)

apiInfo := struct { Endpoint, Namespace, Version string }{
	Endpoint: "/v1/hobo",
	Namespace: gaeNamespace,
}

key := datastore.NewKey(namespacedContext, "ApiInfo", "ApiInfo", 0, nil)
datastore.Put(namespacedContext, key, &apiInfo)
```

# Future work

Need to introduce a `Smoke Tests` step in the pipeline after each deploy to each environment.
