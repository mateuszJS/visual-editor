We have predefiend REM values in global css like:

--14px: 0.875rem;
--15px: 0.9375rem;
--16px: 1rem;
...

to:

1. Avoid computations like calc(20rem / 16) to get 20px in rem
2. It helps us use rounded valies without syntax like "round(0.8rem, 1px);". Rounded values are helpful while screenshot testing, on my local Mac vs Github actions ubuntu usually gets 1-2px difference in size while using rems with decimal points.
