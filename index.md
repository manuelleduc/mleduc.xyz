---
# You don't need to edit this file, it's empty on purpose.
# Edit theme's home layout instead if you wanna make some changes
# See: https://jekyllrb.com/docs/themes/#overriding-theme-defaults
layout: home
---

* [xwiki.org](https://xwiki.org) contributor
* Software Engineer @[XWiki SAS](https://xwiki.com/)

{% if site.posts.size > 0 %}
<h2 class="post-list-heading">{{ page.list_title | default: "Blog Posts" }}</h2>
<ul class="post-list">
  {% for post in site.posts %}
  <li>
    {% assign date_format = site.minima.date_format | default: "%b %-d, %Y" %}
    <span class="post-meta">{{ post.date | date: date_format }}</span>
    <h3>
      <a class="post-link" href="{{ post.url | relative_url }}">
        {{ post.title | escape }}
      </a>
    </h3>
    {% if site.show_excerpts %}
      {{ post.excerpt }}
    {% endif %}
  </li>
  {% endfor %}
</ul>

<p class="rss-subscribe">subscribe <a href="{{ "/feed.xml" | relative_url }}">via RSS</a></p>
{% endif %}
