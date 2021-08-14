ansible-roles:
	deno run -A --unstable examples/ansible.ts

fmt:
	@deno fmt .

lint:
	@deno lint .

build: fmt lint ansible-roles

run:
	deno run -A --importmap=importmap.json bin/${bin}.ts ${args}