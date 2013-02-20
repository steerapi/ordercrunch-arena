COFFEE = $(shell find customer -name "*.coffee" -type f)
JS = $(COFFEE:.coffee=.js)

all: customer/index.js
watch:
	watch -n 1 make
customer/index.js: $(COFFEE)
	browserify customer/customer.coffee -o customer/index.js
