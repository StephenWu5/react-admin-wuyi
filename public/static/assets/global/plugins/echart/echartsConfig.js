var Charts = {
	create : function(elmId, extend) {
		var Result = function(elmId, options) {
			this.elmId = elmId;
			this.options = options;
			this.init();
		};
		
		Result.prototype = {
			init : function() {
				var self = this;
                self.chart = echarts.init(document.getElementById(self.elmId));
                self.chart.showLoading();
                self.chart.setOption(self.options);
                $(window).resize(self.throttle(function () {
                    self.chart.resize();
                },100));
			},
			 throttle:function (fn,dealy) {
                 var timer = null;
                 return function () {
                     var context = this,
                         args = arguments;
                     clearTimeout(timer);
                     timer = setTimeout(function () {
                         fn.apply(context,args);
                     },dealy);
                 }
             },
			setOptions : function(options) {
				this.chart.hideLoading();
				this.chart.setOption(options);
			}
		};
		return new Result(elmId, extend);
	},

	// 供应商器材数量
	drawEquipmentNumChart : function() {
		var cgi = '/indexInfo/supplierChart', myChart = this.create(
			'j_equipmentNumChart', {
				backgroundColor : '#FFF',
				title : {
					top : 10,
					textStyle : {
						color : '#ccc'
					}
				},

				tooltip : {
					trigger : 'item',
					formatter : "{a} <br/>{b} : {c} ({d}%)"
				},

				visualMap : {
					show : false,
					min : 80,
					max : 600,
					inRange : {
//							colorLightness : [ 0, 1 ]
					}
				},
				series : [ {
					name : '供应商',
					type : 'pie',
					radius : '60%',
					center : [ '50%', '50%' ],
					roseType : 'angle',
					label : {
					},
					labelLine : {
						normal : {
							smooth : 0.2,
							length : 10,
							length2 : 20
						}
					},
				} ]
			});

		this.getData(cgi).done(function(result) {
			(result.errCode == 0) && function(data) {
				myChart.setOptions({
					series : [ {
						data : data.sort(function(a, b) {
							return a.value - b.value
						})
					} ]
				});
			}(result.obj);
		});
	},

	// 设备安装年份
	drawEquipmentInstallationYearChart : function() {
		var cgi = '/indexInfo/eqpTimeChart', myChart = this.create(
				'j_equipmentInstallationYearChart', {
					title : {},
					color : [ '#7A67EE' ],
					tooltip : {},
					legend : {
						data : [ '设备安装数量' ]
					},
					xAxis : {
						data : []
					},
					yAxis : {},
					series : [ {
						name : '设备安装数量',
						type : 'bar',
						data : []
					} ]
				});

		this.getData(cgi).done(function(result) {
			(result.errCode == 0) && function(data) {
				var chartData = {
					categories : [],
					data : []
				};
				$.each(data, function(i, v) {
					chartData.categories.push(v.name);
					chartData.data.push(v.value);
				});

				myChart.setOptions({
					xAxis : {
						data : chartData.categories
					},
					series : [ {
						// 根据名字对应到相应的系列
						name : '设备安装数量',
						data : chartData.data
					} ]
				});
			}(result.obj);
		});
	},

	// 设备状态分布
	drawEquipmentChart : function() {
		var cgi = '/indexInfo/eqpStatusChart', myChart = this.create(
				'j_equipmentChart', {
					tooltip : {
						trigger : 'item',
						formatter : "{a} <br/>{b} : {c} ({d}%)"
					},
					legend : {
						orient : 'vertical',
						left : 'left'
					},
					series : [ {
						name : '设施状态',
						type : 'pie',
						radius : '55%',
						center : [ '50%', '60%' ],
						itemStyle : {
							emphasis : {
								shadowBlur : 10,
								shadowOffsetX : 0,
								shadowColor : 'rgba(0, 0, 0, 0.5)'
							}
						}
					} ]
				});

		this.getData(cgi).done(function(result) {
			(result.errCode == 0) && function(data) {
				var legendData = [];
				$.each(data, function(i, v) {
					legendData.push(v.name);
				});

				myChart.setOptions({
					legend : {
						data : legendData
					},
					series : [ {
						data : data
					} ]
				});
			}(result.obj);
		});
	},

	// 设备使用安全警示
	drawEquipmentSafetyChart : function() {
		var cgi = '/indexInfo/eqpSafeChart', myChart = this.create(
			'j_equipmentSafetyChart', {
				tooltip : {
					trigger : 'axis',
					axisPointer : { // 坐标轴指示器，坐标轴触发有效
						type : 'shadow' // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				legend : {},
				grid : {
					left : '3%',
					right : '4%',
					bottom : '3%',
					containLabel : true
				},
				xAxis : {
					type : 'value'
				},
				yAxis : {
					type : 'category',
					data : []
				//                            axisLabel:{
				//                                formatter:'{value} 件'
				//                            }
				},
				series : []
			});

		this.getData(cgi).done(function(result) {
			(result.errCode == 0) && function(data) {
				var chartData = {
					legendData : [ '已使用年限', '可安全使用年限',
							'危险期限' ],
					yAxisData : [],
					seriesData : [
							{
								name : '已使用年限',
								type : 'bar',
								stack : '总量',
								label : {
									normal : {
										show : true,
										position : 'insideRight'
									}
								},
								itemStyle : {
									normal : {
										color : '#030303'
									}
								},
								data : []
							},
							{
								name : '可安全使用年限',
								type : 'bar',
								stack : '总量',
								itemStyle : {
									normal : {
										color : '#71C671'
									}
								},
								label : {
									normal : {
										show : true,
										position : 'insideRight'
									}
								},
								data : []
							},
							{
								name : '危险期限',
								type : 'bar',
								stack : '总量',
								itemStyle : {
									normal : {
										color : '#CD0000'
									}
								},
								label : {
									normal : {
										show : true,
										position : 'insideRight'
									}
								},
								data : []
							} ]
				};

				$.each(data, function(i, v) {
					chartData.yAxisData.push(v.name
							+ '件');
					chartData.seriesData[0]['data']
							.push(v.value);
					chartData.seriesData[1]['data']
							.push(7.5 - v.value);
					chartData.seriesData[2]['data']
							.push(v.value <= 7.5 ? 0.5
									: 0);
				});

				myChart.setOptions({
					legend : {
						data : chartData.legendData
					},
					yAxis : {
						data : chartData.yAxisData
					},
					series : chartData.seriesData
				});
			}(result.obj);
		});

	},
	drawMapChart : function() {
        var cgi = '/indexInfo/installAreaChart',
            convertData = function (data) {
                var res = [];
                for (var i = 0; i < data.length; i++) {
                    res.push({
                        name: data[i].name,
                        value: [data[i].lng,data[i].lat,data[i].value]
                    });
                }
                return res;
            },
            option = {
                title: {
                    text: '全国设备场地分布图',
                    left: 'center'
                },
                tooltip : {
                    trigger: 'item'
                },
                bmap: {
                    center: [104.114129, 37.550339],
                    zoom: 5,
                    roam: true,
                    mapStyle: {
                        styleJson: [{
                            'featureType': 'water',
                            'elementType': 'all',
                            'stylers': {
                                'color': '#d1d1d1'
                            }
                        }, {
                            'featureType': 'land',
                            'elementType': 'all',
                            'stylers': {
                                'color': '#f3f3f3'
                            }
                        }, {
                            'featureType': 'railway',
                            'elementType': 'all',
                            'stylers': {
                                'visibility': 'off'
                            }
                        }, {
                            'featureType': 'highway',
                            'elementType': 'all',
                            'stylers': {
                                'color': '#fdfdfd'
                            }
                        }, {
                            'featureType': 'highway',
                            'elementType': 'labels',
                            'stylers': {
                                'visibility': 'off'
                            }
                        }, {
                            'featureType': 'arterial',
                            'elementType': 'geometry',
                            'stylers': {
                                'color': '#fefefe'
                            }
                        }, {
                            'featureType': 'arterial',
                            'elementType': 'geometry.fill',
                            'stylers': {
                                'color': '#fefefe'
                            }
                        }, {
                            'featureType': 'poi',
                            'elementType': 'all',
                            'stylers': {
                                'visibility': 'off'
                            }
                        }, {
                            'featureType': 'green',
                            'elementType': 'all',
                            'stylers': {
                                'visibility': 'off'
                            }
                        }, {
                            'featureType': 'subway',
                            'elementType': 'all',
                            'stylers': {
                                'visibility': 'off'
                            }
                        }, {
                            'featureType': 'manmade',
                            'elementType': 'all',
                            'stylers': {
                                'color': '#d1d1d1'
                            }
                        }, {
                            'featureType': 'local',
                            'elementType': 'all',
                            'stylers': {
                                'color': '#d1d1d1'
                            }
                        }, {
                            'featureType': 'arterial',
                            'elementType': 'labels',
                            'stylers': {
                                'visibility': 'off'
                            }
                        }, {
                            'featureType': 'boundary',
                            'elementType': 'all',
                            'stylers': {
                                'color': '#fefefe'
                            }
                        }, {
                            'featureType': 'building',
                            'elementType': 'all',
                            'stylers': {
                                'color': '#d1d1d1'
                            }
                        }, {
                            'featureType': 'label',
                            'elementType': 'labels.text.fill',
                            'stylers': {
                                'color': '#999999'
                            }
                        }]
                    }
                },
                series : [
                    {
                        name: '全国设备场地分布图',
                        type: 'scatter',
                        coordinateSystem: 'bmap',
                        data: [],
                        symbolSize: 8,
                        label: {
                            normal: {
                                formatter: '{b}',
                                position: 'right',
                                show: false
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: 'purple'
                            }
                        }
                    },
                    {
                        name: 'Top 5',
                        type: 'effectScatter',
                        coordinateSystem: 'bmap',
                        data: [],
                        symbolSize: 15,
                        showEffectOn: 'render',
                        rippleEffect: {
                            brushType: 'stroke'
                        },
                        hoverAnimation: true,
                        label: {
                            normal: {
                                formatter: '{b}',
                                position: 'right',
                                show: false
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: 'purple',
                                shadowBlur: 10,
                                shadowColor: '#333'
                            }
                        },
                        zlevel: 1
                    }
                ]
            },
            myChart = this.create('j_mapChart',option);

        this.getData(cgi).done(function (result) {
            (result.errCode == 0) && function (data) {
                myChart.setOptions($.extend({
                    series: [{
                        data: convertData(data.data)
                    },{
                        data: convertData(data.data.sort(function (a, b) {
                            return b.value - a.value;
                        }).slice(0, 6))
                    }]
                },function (center) {
                    return center ? {
                        bmap: {
                            center: [center.lng,center.lat],
                            zoom: 8
                        }
                    } : {};
                }(data.center)));
            } (result.obj);
        })
	},
	initAreaCount : function() {
        var cgi = '/indexInfo/initAreaItemCount';
        $.get(cgi, function(result){
        	if(result.errCode == 0){
        		$('#areaCount').html(result.obj.areaCount);
        		$('#itemCount').html(result.obj.itemCount);
        	}
        });
	},
	init : function() {
		this.initAreaCount();
		this.drawMapChart();
		this.drawEquipmentNumChart();
		this.drawEquipmentInstallationYearChart();
		this.drawEquipmentChart();
		this.drawEquipmentSafetyChart();
	},
	getData : function(url) {
		return $.ajax({
			url : url,
			dataType : 'json',
			cache : false,
			type : 'GET'
		}).fail(function() {
			// 请求失败

		}).done(function(result) {
			if (result && (result.errCode !== 0)) {
				result.errMsg && alert(result.errMsg);
			}
		});
	}
};

Charts.init();