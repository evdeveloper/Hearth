(function (parentObject) {
	// Проверяем на повторную инициализацию
    if (parentObject.validation)
        return;

    ////////////////////////////////////////////////
    // Создаем общий интерфейс для валидации форм
    ////////////////////////////////////////////////
    parentObject.validation = {
		_defaultOptions: {
			// Контейнер. Может быть селектором или элементом
			container: '',
			// Селектор для поиска полей
			fieldSelector: '.modal__input, .form__email',
			// Проверка в режиме онлайн
			liveCheck: true,
			// Селектор для кнопок сабмита
			submitSelector: '[data-modal="btn"]',
			// Обработчик, который вызывается после успешной валидации
			submitHandler: null,
			// Класс полей с ошибками
			errorClass: 'modal_error',
			// Класс верных полей
			okClass: 'modal_ok',
			// Список валидаторов
			// Примечание: так как валидатор пустых полей вынесен отдельно,
			// то пустые строки в других валидаторах считаются как прошедшие
			validators: {
				'required': function (str) {
					return str.length > 0;
                },
                'textname': function (str) {
					var regExp = new RegExp('^[а-яА-ЯёЁa-zA-Z0-9\\s]+$');
					return regExp.test(str) || !str;
				},
				'phones': function (str) {
					var regExp = new RegExp('\\-?\\d+((\\.|\\,)\\d{0,})?');
					return regExp.test(str) || !str;
				},
				
				'email': function (str) {
					var regExp = new RegExp('^([a-z0-9_-]+\\.)*[a-z0-9_-]+@[a-z0-9_-]+(\\.[a-z0-9_-]+)*\\.[a-z]{2,6}$');
					return regExp.test(str) || !str;
				}
				
			}
		},

		// Функция инициализации
		// Создает каркас для форм
		init: function (_options) {
			var options = $.extend({}, this._defaultOptions, (_options || {})),
				self = this;

			// Если указан контейнер (или его селектор), 
			// а так же селектор для полей,
			// то создаем каркас
			if (options.container && options.fieldSelector) {
				// Если есть селектор для кнопок,
				// то вещаем обработчик на щелчек
				if (options.submitSelector) {
					$(options.container).find(options.submitSelector).on('click', function () {
						if (self.isValid(options)) {
							// Если указан обработчик, после успешной валиадции,
							// то вызываем его
							if (typeof (options.submitHandler) === 'function')
								options.submitHandler();
							return true;
						}
						else {
							return false;
						}
					});
				}

				// Если нужна проверка в режиме онлайн
				if (options.liveCheck) {
					// Проходимся по всем полям и вешаем проверку валидности
					$(options.container).find(options.fieldSelector).each(function (cnt, item) {
						$(item).on('click', function () {
							self.validItem($(item), options)
						}).on('blur', function () {
							self.validItem($(item), options)
						}).on('change', function () {
							self.validItem($(item), options)
						}).on('keyup', function () {
							self.validItem($(item), options)
						});
					});
				}
			}
		},

		// Функция для валидации отдельного элемента
		validItem: function (item, _options) {
			var options = $.extend({}, this._defaultOptions, (_options || {})),
				classList = $(item).attr('class').split(/\s+/),
				validResult = true;
			// Проходимся по всем классам в атрибуте "class", 
			// и если находим класс с именем валидатора, то вызываем его
			$.each(classList, function (index, cl) {
				// Проверка для повторяющихся полей,
				// имя поля, которое должно повториться указывается в атрибуте "confirm-field"
				if (cl === 'confirmfield') {
					validResult 
						&= ($(options.container).find('[Name="' + $(item).attr('confirm-field') + '"]').val()
							== $(item).val());
				}
				// Иначе обычная проверка
				else if (typeof (options.validators[cl]) === 'function') {
					validResult &= options.validators[cl](item.val());
				}
			});

			// Если поле не прошло валидацию
			if (!validResult)
				$(item).addClass(options.errorClass).removeClass(options.okClass);
			// Поле прошло валидацию
			else
				$(item).addClass(options.okClass).removeClass(options.errorClass);

			// Возвращаем результат
			return validResult;
		},

		// Проверка всех полей произвольной формы
		isValid: function (_options) {
			var options = $.extend({}, this._defaultOptions, (_options || {})),
				validResult = true,
				self = this;
			// Если указан контейнер (или его селектор), а так же селектор для полей,
			// то проверяем все поля
			if (options.container && options.fieldSelector) {
				$(options.container).find(options.fieldSelector).each(function (cnt, item) {
					validResult &= self.validItem($(item), options);
				});
			}

			// Возвращаем результат проверки
			return validResult;
		},

		// Очищаем поля от всех классов стилей, которые были добавлены во время проверки
		clear: function (_options) {
			var options = $.extend(true, {}, this._defaultOptions, (_options || {}));
			if (options.container && options.fieldSelector) {
				$(options.container).find(options.fieldSelector)
				.removeClass(options.errorClass).removeClass(options.okClass);
			}
		}
    }
    window.validation.init({
        container: '.form',
        submitHandler: function () {
            swal({
                title: "Спасибо за заявку",
                text: "Менеджер свяжется с вами в течении 15 минут",
                icon: "success",
                buttons: false,
                timer: 2000,
                className: 'modal__success'
              });
              
        }
    });
    window.validation.init({
        container: 'form',
        submitHandler: function () {
            swal({
                title: "Спасибо за заявку",
                text: "Менеджер свяжется с вами в течении 15 минут",
                icon: "success",
                buttons: false,
                timer: 2000,
                className: 'modal__success'
              });
              
        }
    });

    
})(window);