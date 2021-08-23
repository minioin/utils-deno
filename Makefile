deno=deno --unstable
drun=$(deno) run --importmap=importmap.json
ansible-roles:
	deno run --unstable -A examples/ansible.ts

fmt:
	@deno fmt .

lint:
	@deno lint .

test:
	@deno --unstable test

build: fmt lint test ansible-roles

run:
	deno run -A --importmap=importmap.json bin/${bin}.ts ${args}