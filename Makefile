.PHONY: build copy clean

build: clean copy
	npm run rollup && npm run style

clean:
	/bin/rm -f dest/*.*

copy:
	cp src/popup.html dest/ && cp src/logo.png dest/
