### What is this?

This cancellation booker uses the endpoints used by the 'Book Test Cancellations NOW' app on the iOS store to repeatedly check for tests within given dates and then book any viable tests

### How to use it

- You'll need a valid account on the 'Book Test Cancellations NOW' app | https://apps.apple.com/gb/app/driving-test-cancellations-now/id1435216028
- You'll need to intercept the BEARER token for your account

<ol>
<li>Run 'npm i' in the console</li>
<li>Put your BEARER token into the variable 'token' in '/runner.js'</li>
<li>Edit the 'minDays' and 'maxDays' to set the lower and upper limit of acceptable days until</li>
<li>Run the 'search' script in the '/package.json'</li>
</ol>

