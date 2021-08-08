ansible-roles:
	deno run -A --unstable examples/buildroles.ts

fmt:
	@deno fmt .

build: fmt ansible-roles