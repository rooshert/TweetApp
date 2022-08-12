import os, ipdb
from django.core.management.base import BaseCommand
from django.conf import settings

PATH2STATIC = settings.STATIC_ROOT
PATH2TEMPLATES = settings.TEMPLATES_DIR + '\\react'

class Command(BaseCommand):
	'''
		Комманда обновления ссылок на статические файлы реакта в django-шаблонах
	'''
	success_display = 'links to react static files updated!'
	error_display = 'it was not possible to set links to static files of react! Something went wrong!'
	static_names = ['js', 'css']

	def search_static_files(self, *args, **kwargs):
		# ipdb.set_trace()
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
				link = '<script src="\\static\\{0}\\{1}"></script>'
			else:
				link = '<link href="\\static\\{0}\\{1}" rel="stylesheet">'

			path = PATH2TEMPLATES + '\\{0}.html'.format(dir_name) 
			with open(path, 'w') as f:
				sf_lst = self._static_files[dir_name]
				for sf in sf_lst:
					f.write(link.format(dir_name, sf))
				f.close()

	def handle(self, *args, **kwargs):
		try:
			self.search_static_files().write_staticfiles_2_template()
			self.stdout.write(self.style.SUCCESS(self.success_display))
		except:
			self.stdout.write(self.style.WARNING(self.error_display))
			