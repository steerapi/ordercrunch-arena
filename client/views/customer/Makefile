JADE = $(shell find . -name "*.jade" -type f)
HTML = $(JADE:.jade=.html)

all: ../customer.html

watch:
	watch -n 1 make

../customer.html: $(JADE)
	jade -p . customer.jade -O ../

clean:
	rm -f ../customer.html

.PHONY: all watch clean