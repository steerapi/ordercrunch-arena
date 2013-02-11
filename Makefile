all:
	cd client/views/customer && make
	cd client/views/business && make

watch:
	watch -n 1 make all
