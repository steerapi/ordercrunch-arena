JADE = $(shell find . -name "*.jade" -type f)
HTML = $(JADE:.jade=.html)

all: ../business.html

watch:
	watch -n 1 make

../business.html: $(JADE)
	jade -p . business.jade -O ../

clean:
	rm -f ../business.html

.PHONY: all watch clean