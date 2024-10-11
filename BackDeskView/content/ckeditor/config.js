/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	config.toolbar = 'Full';
	config.toolbar = [
		{ name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
		{ name: 'basicstyles', groups: ['basicstyles'], items: ['Bold', 'Italic', 'Underline', 'Strike'] },
		{ name: 'paragraph', groups: ['list', 'align'], items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', 'NumberedList', 'BulletedList'] },
		{ name: 'clipboard', groups: ['undo'], items: ['Undo', 'Redo'] },
		{ name: 'insert', groups: ['insert', 'links'], items: ['Image', 'Table', 'Link', 'Unlink'] },
		{ name: 'document', groups: ['document', 'doctools'], items: ['Templates', 'Source'] },
		{ name: 'tools', items: ['Maximize'] }
	];
	// Define changes to default configuration here.
	// For complete reference see:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config

	// The toolbar groups arrangement, optimized for two toolbar rows.
	config.toolbarGroups = [
		{ name: 'clipboard', groups: ['clipboard', 'undo'] },
		{ name: 'editing', groups: ['find', 'selection', 'spellchecker'] },
		{ name: 'links' },
		{ name: 'insert' },
		{ name: 'forms' },
		{ name: 'tools' },
		{ name: 'document', groups: ['mode', 'document', 'doctools'] },
		{ name: 'others' },
		'/',
		{ name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
		{ name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'] },
		'/',
		{ name: 'styles'},
		{ name: 'colors'},
		{ name: 'tools'}
	];

	// Brazil colors only.
	config.colorButton_colors = '00923E,F8C100,28166F';

	config.colorButton_colors = 'FontColor1/FF9900,FontColor2/0066CC,FontColor3/F00';

	// CKEditor color palette available before version 4.6.2.
	config.colorButton_colors =
		'000,800000,8B4513,2F4F4F,008080,000080,4B0082,696969,' +
		'B22222,A52A2A,DAA520,006400,40E0D0,0000CD,800080,808080,' +
		'F00,FF8C00,FFD700,008000,0FF,00F,EE82EE,A9A9A9,' +
		'FFA07A,FFA500,FFFF00,00FF00,AFEEEE,ADD8E6,DDA0DD,D3D3D3,' +
		'FFF0F5,FAEBD7,FFFFE0,F0FFF0,F0FFFF,F0F8FF,E6E6FA,FFF';

	// Remove some buttons provided by the standard plugins, which are
	// not needed in the Standard(s) toolbar.
	config.removeButtons = 'Underline,Subscript,Superscript';

	// Set the most common block elements.
	config.format_tags = 'p;h1;h2;h3;pre';

	// Simplify the dialog windows.
	config.removeDialogTabs = 'image:advanced;link:advanced';

	// 加入base64圖片的轉換
	config.extraPlugins = 'base64image,colorbutton';
};
