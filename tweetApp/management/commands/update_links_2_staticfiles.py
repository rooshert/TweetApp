import os
from django.core.management.base import BaseCommand
from django.conf import settings

PATH2STATIC = settings.STATIC_ROOT
PATH2TEMPLATES = settings.TEMPLATES_DIR + '/react'

class Command(BaseCommand):
	'''
		Комманда обновления ссылок на статические файлы реакта в django-шаблонах
	'''
	display = 'links to react static files updated!'
	static_names = ['js', 'css']

	def search_static_files(self, *args, **kwargs):
		sf = {}
		for dir_name in self.static_names:
			files_lst = [
				path for path in os.listdir(PATH2STATIC + '/%s' % (dir_name)) 
				if '.%s.' % (dir_name) not in path
			]
			sf.update({dir_name: files_lst})

		self._static_files = sf
		return self

	def write_staticfiles_2_template(self, *args, **kwargs):
		for dir_name in self.static_names:
			if dir_name == 'js':
				formatted_link = '<script defer="defer" src="\\static\\%s\\%s"></script>'
			else:
				formatted_link = '<link href="\\static\\%s\\%s" rel="stylesheet">'

			with open(PATH2TEMPLATES + '/%s.html' % dir_name, 'w') as f:
				static_files_lst = self._static_files[dir_name]
				for sf in static_files_lst:
					f.write(formatted_link % (dir_name, sf))
				f.close()

	def handle(self, *args, **kwargs):
		self.search_static_files().write_staticfiles_2_template()
		print(self.display)
