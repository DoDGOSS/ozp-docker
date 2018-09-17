from django.shortcuts import redirect
from django.http import HttpResponseForbidden




class HandleUnauthenticatedAJAXRequestsMiddleware:
    """
    Optional middleware. Unauthenticated AJAX requests are rejected as 403
    Forbidden.

    Non-AJAX requests are redirected to the login page
    (handled in CASbackend Middleware)
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        if request.user.is_authenticated():
            return response

        if request.is_ajax() or not request.META.get('HTTP_ORIGIN') is None:
            return HttpResponseForbidden()

        return response
