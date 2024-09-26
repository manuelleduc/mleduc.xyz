+++
title = 'Dynamic Junit 5: The Hero with a Thousand Faces'
date = 2019-03-11 10:50:00+02:00
url = '/java/junit5/dynamic/unit/test/2019/03/11/dynamic-junit5.html'
+++

Writting unit tests is a difficult and time consuming task.
And, in my opinion, even more when used to test code generating programs, such as compiler.

But as it is something I am dealing with on a daly basis, writting a compiler for [ALE](https://github.com/gemoc/ale-lang), why not automate some part of if and make my life easier?

Consequently, I wanted to load some programs, produce a result and compare each file to the expected result.
But it can be difficult to have an interesting and easy to read result from such testing suite.

Moreover, I wanted to have an explicit diff (e.g., diff/git like line by line difference) between the produced file and the expected one in case of failing test.
Additionally, from a single program, my compiler is producing a large amount of files, and an expressive test suite is needed in order to avoid large maintenance cost of the test suite (e.g., having to updated the junit tests souces whenever change in the compiler implementation occure).
Otherwise, I would give up it maintenance quickly and all those cool tests would become deprecated in no time. What a shame.

That is when I came across the [dynamic tests](https://junit.org/junit5/docs/current/user-guide/#writing-tests-dynamic-tests) feature introduced in [Junit 5](https://junit.org/junit5/).
The idea is quite simple, instead of writting a serie of test methods manually, the developper writes a single method that produces a stream of `DynamicTest` instances, that are later executed as regular unit tests by the Junit execution engine and displayed nicely to the user[^1].

The java class below shows partially how to implement this scenario.
A program is compiled and the directory where the files are saved is returned.
Finally, for each file in the `test-result` directory, a unit test is generated.
```java
class DynamicFileTest {

  /** produces a stream of DynamicTest*/
  @TestFactory Stream<DynamicTest> dynamicTests() {
      // expected results
      File expectedDir = new File("src/test/resources/test-result");
      
      // compile a program and return a directory with the 
      // result of the compilation
      File resultDir = compile(input); 
      Collection<File> files = FileUtils.listFiles(expectedDir,
        TrueFileFilter.INSTANCE, TrueFileFilter.INSTANCE);
      String unitTestName = f.getName();

      // map on the expected files
      return files.stream().map(f -> DynamicTest.dynamicTest(unitTestName,

          // compare each produced file with it expected result
          () -> {
              Path relative = expectedDir.toPath().relativize(f.toPath());
              String relativePath = relative.toFile().getPath();
              File bfile = new File(resultDir, relativePath);
              if (bfile.exists()) {
                Charset charset = Charset.defaultCharset();
                String expected = FileUtils.readFileToString(f, charset);
                String result = FileUtils.readFileToString(bfile, charset);

                // raise an error in case of difference.
                Assertions.assertEquals(expected, result);
              } else {
                // raise an error in case of missing file.
                Assertions.fail(relativePath + " expected to exist");
              }
          }));
  }
} 
```

The result of the execution is the usual Junit results summary displayed in the IDE, indistinguable from a static unit test result, as shown below.

![screenshot of the unit test execution of IntelliJ]({{ site.baseurl }}/assets/screen-dynamic-tests.png)

An exhaustive version, with maven integration is available on my [github account](https://github.com/manuelleduc/junit5-dynamic-test-example).

Once the definition the generic dynamic test done, maintaining the unit test suite is a breeze since it is only a matter of defining the input (*programs*) and output (*expected files*).

I am currently using this technique to write hundre of tests for my compiler, and in my experience it has been a straighforward and productive way to write compiler test suites.


Let me know if you have had a differents experience from mine!

[^1]: At least on Eclipse and Intellij. I am yet to test how it is integrated with [jenkins](https://jenkins.io/).
