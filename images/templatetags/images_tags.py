from django import template

register = template.Library()


@register.filter
def russian_pluralize(value, arg=None):
    forms = arg.split(',')
    if not forms or len(forms) != 3:
        return ''

    try:
        value = abs(int(value))
    except (TypeError, ValueError):
        return forms[2]

    if value % 10 == 1 and value % 100 != 11:
        form = forms[0]
    elif 2 <= value % 10 <= 4 and (value % 100 < 10 or value % 100 >= 20):
        form = forms[1]
    else:
        form = forms[2]
    return form
