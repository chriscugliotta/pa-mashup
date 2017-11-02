# Background

I built this Qlik Sense mashup as a learning exercise.  It introduced me to many webdev concepts, such as:

- HTML
- CSS (Bootstrap, Flexbox, and more)
- JavaScript (JQuery, Promises, RequireJS, Qlik Sense API, and more)
- AngularJS 1.x (components, templating, routing, data binding, MVC)

What I learned above all else is:  front-end web development is a dumpster fire.

# Functionality

This code serves as a flexible/configurable outer shell, which can house any Qlik Sense app (i.e. QVF file).  I implemented the following AngularJS components:

- `nav`:  A slide-in navigation menu that handles tab switching and field selection.
- `vizContainer`:  A container that wraps any Qlik Sense visualization.  It provides a title, subtitle, and an icon row:  cycle group, export, and expand/collapse.
- `kpiContainer`:  A container that displays a large icon, number, and progress bar.  The number and progress bar are linked to Qlik Sense expressions.
- `header`:  Page header, which displays all active Qlik selections.

You can see examples of these components below:

<img src="https://i.imgur.com/SUzKrKW.png" height=50% width=50%></img>

<img src="https://i.imgur.com/MeVyKES.png" height=50% width=50%></img>

<img src="https://i.imgur.com/4b2ePaq.png" height=50% width=50%></img>

# How to Run

Clone this repository into:  `C:\Users\%username%\Documents\Qlik\Sense\Extensions\pa-mashup`.

In a web browser, go to: `http://localhost:4848/dev-hub/`, go to Mashups, and click on this mashup.  This will open an editor, which you can immediately close.  (For some reason, this step is needed, or else the next step will fail.)

In a web browser, go to: `http://localhost:4848/extensions/pa-mashup/pa-mashup.html`.