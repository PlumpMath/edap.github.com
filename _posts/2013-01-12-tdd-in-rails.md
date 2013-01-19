---
layout: post
title: "TDD in Rails"
category: 
status: published
tags: [ruby on rails, TDD, rspec, factorygirls, cucumber]
---
{% include JB/setup %}
<h4>First: No code is safe.</h4>
Start asking your code: "Are you good enough to pass this test?". If he didn't answer, write a test and fire the console<br />.Be active, don't wait until your code start screaming. It's a common habit to think "i will write later my test code". No, you will not, you will have other things to do, bug fixing, new features, or take a wal outside, but no, abslolutly, no test code.<br /> To avoid procrastination, testing has to be integrated in the development code cycle. The most complete TDD definition that i found on the net comes from <a href="http://www.agileskillsproject.org/agile-skills-inventory/technical-excellence/test-driven-design-tdd">agileskillsproject.org</a>:<br />
<i>Test-Driven Development (TDD) is a way of driving the design of code by writing a test which expresses what you intend the code to do, making that test pass, and continuously refactoring to keep the design as simple as possible. TDD can apply at multiple levels, e.g., Customer Tests, Integration Tests, Unit Tests.<br />
Test-Driven Development/Design follows a rigorous cycle. Start by writing a failing test (Red.) Implement the simplest solution that will cause the test to pass (Green.) Search for duplication and remove it (Refactor.) "RED-GREEN-REFACTOR" has become almost a mantra for many TDD practitioners. Understanding and even internalizing this cycle is key to being able to use TDD to solve problems.</i><br>
Kent Beck rediscovered this technique in 2003, and from his book "Test-Driven Development by example" is taken this <a href="http://en.wikipedia.org/wiki/Test-driven_development#Test-driven_development_cycle">part</a> on the wiki page about TDD.

Citation da Pragmatic programmers, 
<h4>Test Driven Development in Rails</h4>
How it work's on Ruby on Rails? First of all, you have to include Rspec for ours Integration tests (known as "request specs" in the context of RSpec), so edit your Gemfile, add the following lines and run : <br />
{% highlight ruby %}
gem 'rspec-rails', :group => [:development, :test]
gem 'factory_girl_rails', :group => [:development, :test]

group :test do
  gem 'database_cleaner'
  gem 'email_spec'
  gem 'cucumber-rails'
  gem 'launchy'
  gem 'capybara'
end
{% endhighlight ruby %}
Notes, we have added also Capybara, Cucumber, FactoryGirls and DatabaseCleaner, during this post we will see how and when use them.
Now running "rails generate rspec:install" to preare your application for the testing you will have this files .rspec, the spec/spec_helper.rb, and the folder spec, that is used to store the test files. You can safely remove the folder "test", if you have created your app without the flag "-T".<br />
To write the rspec files from scratch, we will create a controller with some view.<br />
To do so, we will use the flag "--no-test-framework" to suppress the generation of the default Rspec tests.	
{% highlight ruby %}
rails generate controller Pages home help --no-test-framework
{% endhighlight ruby %}
After that, we'll generate the integration test file for the pages controller
{% highlight ruby %}
rails generate integration_test pages
{% endhighlight ruby %}
This will generate the file spec/requests/pages_spec.rb. Add this line at "require 'capybara/rspec'" in your spec_helper.rb file. Copy this file in another folder, called spec/features/pages_spec.rb.
Yeah, in spec/ we'll have 2 subfolders, one called requests and the other one called fetaures. In the folder spec/features we are going to store <a href="https://www.relishapp.com/rspec/rspec-rails/v/2-12-2/docs/feature-specs/feature-spec">RSpec feature specs</a> (with capybara),  and in spec/requests/ all the <a href="https://www.relishapp.com/rspec/rspec-rails/v/2-12-2/docs/request-specs/request-spec">RSpec request specs</a>. Request specs are intended to run Integratione test, feature specs are used to driving web application, cheking url and verify content.
Use the first one to test interactions with your application as a HTTP API. Use features specs (with capybara) to test your application like a user could do it. <br>
This is a necessary reading about <a href="http://alindeman.github.com/2012/11/11/rspec-rails-and-capybara-2.0-what-you-need-to-know.html">rspec-rails and capybara</a>.<br>
Now will write some test that HAS to fail.This is an important point, you are defining a new feature or starting from skratch, your code is not ready for your requirement. If the test does not fail, either your text was wrong, or your code was just ready to pass the test. Both, are wrong. You have to code untill your code pass the test. After that start to refactoring your code, write new test if necessary, and write the small amount of code necessary to pass the test. Now, back on the code.
{% highlight ruby %}
require 'spec_helper'

describe "Home page" do
  it "should have the content 'this text is not here'" do
    visit '/pages/home'
    page.should have_content('this text is not here')
  end
end 
{% endhighlight ruby %}

Run this command and watch it fail. 
{% highlight ruby %}
bundle exec rspec spec/features/pages_spec.rb
{% endhighlight ruby %}
It fails because in the page views/pages/home there is no text 'this text is not here'. Correct the view inserting this text and re-run the test. The same test for RSpec request specs (in spec/requests/), is slightly different.
{% highlight ruby %}
require 'spec_helper'

describe "Home page" do
  it "should have the content 'also this text is not here'" do
    get '/pages/home'
    expect(response.body).to include("also this text is not here")
  end
end
{% endhighlight ruby %}
Note, i've write this example just to point out some differences between the two methods, but they should never be used for the same goal, each of them is more appropriated than the other in a specific context, it's up to you find the right one.
 
<h4>Introducing Behaviour Drive Development</h4>
<h4>FactoryGirls, not Fixtures</h4>

{% highlight ruby %}
{% endhighlight ruby %}

PROBLEM Between capybara and rspec
http://alindeman.github.com/2012/11/11/rspec-rails-and-capybara-2.0-what-you-need-to-know.html


link
wiki
http://en.wikipedia.org/wiki/Test-driven_development

getting started
http://stackoverflow.com/questions/1386562/how-to-get-started-on-tdd-with-ruby-on-rails
Detailed explanation for the first steps development http://ruby.railstutorial.org/chapters/static-pages#sec-TDD

best practices
https://docs.google.com/document/d/1gi00-wwPaLk5VvoAJhBVNh9Htw4Rwmj-Ut88T4M2MwI/mobilebasic?pli=1&hl=en
http://bitfluxx.com/2011/05/23/some-rspec-tips-and-best-practices.html

Slides about different types of tests
http://alindeman.github.com/acceptance_testing


Capybara
https://github.com/jnicklas/capybara
http://rubydoc.info/github/jnicklas/capybara

Matt Wynne blog
http://blog.mattwynne.net/

Chris Parsons Blog
http://chrismdp.com/

They run together this project about behaviuor test development (i will write soon about it)
http://bddkickstart.com/