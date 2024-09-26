+++
title = 'ClojureScript Quil Demo'
date = 2019-06-12 15:37:00+02:00
url = '/clojure/clojurescript/quil/processing/generative/art/2019/06/12/clojurescript-quil-demo.html'
+++


<div id="hello-quil"></div>
<script src="{{ "/assets/2019-06-12-clojurescript-quil-demo/js/main.js" | relative_url }}"></script>
<script>hello_quil.core.run_sketch()</script>

```clojure
(ns hello-quil.core
  (:require [quil.core :as q :include-macros true]
            [quil.middleware :as m]))


(def max-itt 250)
(def width 740)

(defn setup []
  (q/color-mode :hsb 360 100 100)
  {:color 0 :angle 0})

(defn update-state [state] {:itt (+ (:itt state) 1)})

(defn power-curve []
  (let [i (int (q/random 1 30))]
    (cond (= i 1) 6
          (= i 2) 2
          (= i 3) 2
          (= i 4) 2
          :else 1)))

(defn draw-state [state]
  (let [itt (:itt state)]
    (if (= itt 0) (q/background 255))
    (q/translate (* 0.25 width) (* 0.25 width))
    (q/rotate (/ (* itt 360.0) max-itt))
    (q/fill 0 0 0 0.0)
    (q/stroke-weight (power-curve))
    (q/ellipse (+ 50 (q/random 0 itt)) 0 (* itt 10) (* itt 10))
    (if (> itt max-itt) (q/no-loop))))

(defn ^:export run-sketch []
  (q/defsketch hello-quil
               :host "hello-quil"
               :size [width width]
               :setup setup
               :update update-state
               :draw draw-state
               :middleware [m/fun-mode]))
```
