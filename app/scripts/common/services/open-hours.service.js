(function() {
	'use strict';

	angular
		.module('restaurant.common')
		.factory('openHoursService', openHoursService);

	openHoursService.$inject = ['_'];

	/* @ngInject */
	function openHoursService(_) {
		var dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

		// Use the converter
		// http://www.ruddwire.com/handy-code/date-to-millisecond-calculators/#.VWQfnVmqpBd
		var openHours = {
			days: [{
				'day': 1, // Monday
				'openAt': 1501066800000, // 8:00
				'closeAt': 1501102800000, // 18:00
			}, {
				'day': 2, // Tuesday
				'openAt': 1501066800000, // 8:00
				'closeAt': 1501102800000, // 18:00
			}, {
				'day': 3, // Wednesday
				'openAt': 1501066800000, // 8:00
				'closeAt': 1501102800000, // 18:00
			}, {
				'day': 4, // Thursday
				'openAt': 1501066800000, // 8:00
				'closeAt': 1501102800000, // 18:00

			}, {
				'day': 5, // Friday
				'openAt': 1501066800000, // 8:00
				'closeAt': 1501102800000, // 18:00
			}, {
				'day': 6, // Saturday
				'openAt': 1501066800000, // 9:00
				'closeAt': 969739200000, // 17:00
			} ],
			zone: 3 // GMT + 3
		};

		var service = {
			isBusinessOpen: isBusinessOpen,
			getOpenHours: getOpenHours
		};
		return service;

		// *****************************************************************

		function getOpenHours() {
			var days = [];
			var groupedDays = _.groupBy(openHours.days, 'day');
			_.each(groupedDays, function(groupedDay) {
				var day = {
					times: []
				};

				_.each(groupedDay, function(d) {
					day.name = dayNames[d.day];
					var openAt = new Date(d.openAt);
					var closeAt = new Date(d.closeAt);

					var from = openAt.format('hh:MMtt');
					var to = closeAt.format('hh:MMtt');
					day.times.push(from + ' - ' + to);
				});

				days.push(day);
			});
			// debugger;
			return days;
		}

		function isBusinessOpen() {
			var now = (new Date());
			var day = now.getDay();
			var hours = now.getHours();
			var minutes = now.getMinutes();

			var fixedTime = (new Date(2015, 0, 1, hours, minutes, 0)).getTime();

			var open;
			for (var i = 0; i < openHours.days.length; i++) {
				open = openHours.days[i];
				if (open.day !== day) {
					continue;
				}

				if (fixedTime >= open.openAt && fixedTime <= open.closeAt) {
					return true;
				}
			}

			return false;
		}
	}
})();
