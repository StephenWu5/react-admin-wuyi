<%@ page language="java" contentType="text/html; charset=UTF-8"
	import="com.baidu.ueditor.ActionEnter" pageEncoding="UTF-8"%>
<%@ page trimDirectiveWhitespaces="true"%>
<%

    request.setCharacterEncoding( "utf-8" );
	response.setHeader("Content-Type" , "text/html");
	
	String rootPath = application.getRealPath( "/" );
	String result = new ActionEnter( request, rootPath ).exec();

	String action = request.getParameter("action");
	//修正文件管理器无法加载图片bug
	if( action!=null && (action.equals("listfile") || action.equals("listimage") ) ){  
		System.out.println("pre:"+rootPath);
		rootPath = rootPath.replace("\\", "/");  
		System.out.println("after:"+rootPath);
		result = result.replaceAll(rootPath, "");  
	}  
	out.write( result );
	
%>