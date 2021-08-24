let ejs = require('ejs');
//const ejsLint = require('ejs-lint');

const htmlEmailTemplate = `<div width="100%" height="100%" style="background-color: #DDDDDD; padding: 64px 16px; font-family: sans-serif">
<div style="background-color: white; padding: 16px; margin: auto; max-width: 500px">
  <div style="color: #5e5c5c; font-family: Arial; font-size: 20px; border-bottom: 1px solid #a0aec0">
    <strong><%= client_name %></strong>
  </div>

  <div style="margin-top: 20px">
    <% if (style === 'faslet') { %>
      <img style="margin-bottom: 20px" src="<%= host %>/faslet-logo.png"/>
    <% } %>
    Click the link below to log into <strong><%= client_name %></strong>.
    <div style="margin: 40px 0">
      <a href="<%= link %>"
        style="display: block; color: white; text-align: center; border: 1px solid <%= button_colour %>; background-color: <%= button_colour %>; border-radius: 8px; padding: 8px; margin: auto; max-width: 200px; min-width: 100px">Login</a>
    </div>
    <div style="font-size: 12px; color: gray">
      If you have trouble, try copying this link into your browser: <div style="margin-top: 8px"><%= link %></div>
    </div>
    <div style="font-size: 12px; color: gray; margin-top: 16px">
      If you have any problems or concerns, please contact <a href="mailto:help@login-with.link">help@login-with.link</a>.
    </div>
  </div>
</div>
</div>`;

const textEmailTemplate = `
<%= client_name %> login link
=======================================

<%= link %>
`;

function formatEmailSubject(params) {
  return `Log into ${params.client_name}`;
}

function formatTextEmail(params) {
  return ejs.render(textEmailTemplate, params)
}

function formatHtmlEmail(params) {
  const { style = null } = params;
  const button_colour = style === 'faslet' ? "#4faf93" : "green";

  return ejs.render(htmlEmailTemplate, {button_colour, ...params})
}

//console.log(ejsLint(textEmailTemplate))

module.exports = { formatEmailSubject, formatTextEmail, formatHtmlEmail };
