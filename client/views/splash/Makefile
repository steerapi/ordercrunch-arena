JADE = $(shell find . -name "*.jade" -type f)
HTML = $(JADE:.jade=.html)

all: ../splash.html

watch:
	watch -n 1 make

../splash.html: $(JADE)
	jade -p . splash.jade -O ../

clean:
	rm -f ../splash.html

.PHONY: all watch clean